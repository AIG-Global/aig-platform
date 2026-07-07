// ============================================================
// AIG Me — personal relationship tracker.
//
// Everything in this app is information the user typed or uploaded
// themselves. There is no web search, no facial recognition, and no
// automated lookup of any kind:
//   - Contacts are added by hand.
//   - Photos are uploaded by hand and tagged by hand (manual box-drawing,
//     not detection).
//   - The "sentiment" field is the user's own private note to themselves,
//     not a computed score.
//   - The "check what's out there" panel only links to tools the person
//     runs themselves (Google Alerts, reverse image search) — it never
//     performs that search on their behalf.
// ============================================================

(function () {
  "use strict";

  if (!window.AIGMeAuth || !window.AIGMeAuth.getCurrentUser()) return;

  const RELATION_LABELS = { family: "Family", friend: "Friend", colleague: "Colleague", other: "Other" };
  const SENTIMENT_LABELS = { positive: "Going well", neutral: "Neutral", negative: "Strained" };

  // ---------------- Storage (all scoped to the logged-in user) ----------------
  function sKey(base) { return window.AIGMeAuth.scopedKey(base); }

  function loadContacts() {
    try { return JSON.parse(localStorage.getItem(sKey("aigme_contacts_v1")) || "[]"); }
    catch (e) { return []; }
  }
  function saveContacts(contacts) {
    localStorage.setItem(sKey("aigme_contacts_v1"), JSON.stringify(contacts));
  }

  function loadGroupPhotos() {
    try { return JSON.parse(localStorage.getItem(sKey("aigme_group_photos_v1")) || "[]"); }
    catch (e) { return []; }
  }
  function saveGroupPhotos(photos) {
    localStorage.setItem(sKey("aigme_group_photos_v1"), JSON.stringify(photos));
  }

  function loadMonitorState() {
    try { return JSON.parse(localStorage.getItem(sKey("aigme_monitor_v1")) || "{}"); }
    catch (e) { return {}; }
  }
  function saveMonitorState(s) {
    localStorage.setItem(sKey("aigme_monitor_v1"), JSON.stringify(s));
  }

  function loadMentions() {
    try { return JSON.parse(localStorage.getItem(sKey("aigme_mentions_v1")) || "[]"); }
    catch (e) { return []; }
  }
  function saveMentions(mentions) {
    localStorage.setItem(sKey("aigme_mentions_v1"), JSON.stringify(mentions));
  }

  const state = {
    contacts: loadContacts(),
    groupPhotos: loadGroupPhotos(),
    mentions: loadMentions(),
    activeRelationFilter: "all",
    activeMentionFilter: "all",
    editingContactId: null,
    editingMentionId: null,
    pendingSentiment: "",
    pendingMentionTone: "",
    taggedBoxes: [] // for the group-photo tagging modal, in-progress
  };

  function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function escapeAttr(s) { return String(s == null ? "" : s).replace(/"/g, "&quot;"); }
  function initials(name) {
    return (name || "?").trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
  }

  // ============================================================
  // Date math — birthdays, custom dates, and shared holidays.
  // Everything here is computed from dates the user entered; nothing
  // is looked up externally.
  // ============================================================

  // US/most-common Mother's Day (2nd Sunday of May) and Father's Day
  // (3rd Sunday of June). If your locale observes different dates,
  // edit these two functions — they're pure date math, not data pulled
  // from anywhere.
  function nthSundayOfMonth(year, month, n) {
    const d = new Date(year, month, 1);
    let sundays = 0;
    while (true) {
      if (d.getDay() === 0) { sundays++; if (sundays === n) return new Date(d); }
      d.setDate(d.getDate() + 1);
    }
  }
  function mothersDay(year) { return nthSundayOfMonth(year, 4, 2); } // May, 2nd Sunday
  function fathersDay(year) { return nthSundayOfMonth(year, 5, 3); } // June, 3rd Sunday

  function nextOccurrence(monthDay, fromDate) {
    // monthDay: {month: 0-11, day: 1-31}. Returns the next date (this year or next) this occurs.
    const now = fromDate || new Date();
    let candidate = new Date(now.getFullYear(), monthDay.month, monthDay.day);
    candidate.setHours(0, 0, 0, 0);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (candidate < today) candidate = new Date(now.getFullYear() + 1, monthDay.month, monthDay.day);
    return candidate;
  }

  function daysUntil(date) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const target = new Date(date); target.setHours(0, 0, 0, 0);
    return Math.round((target - today) / 86400000);
  }

  function parseISODate(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return null;
    return { month: m - 1, day: d, year: y };
  }

  function computeUpcomingEvents() {
    const events = [];
    const now = new Date();

    state.contacts.forEach(c => {
      if (c.birthday) {
        const md = parseISODate(c.birthday);
        if (md) {
          const next = nextOccurrence(md, now);
          events.push({ contact: c, date: next, label: "Birthday", kind: "birthday" });
        }
      }
      if (c.specialDay && c.specialDayLabel) {
        const md = parseISODate(c.specialDay);
        if (md) {
          const next = nextOccurrence(md, now);
          events.push({ contact: c, date: next, label: c.specialDayLabel, kind: "custom" });
        }
      }
      if (c.observesMothersDay) {
        let md = mothersDay(now.getFullYear());
        if (md < startOfToday()) md = mothersDay(now.getFullYear() + 1);
        events.push({ contact: c, date: md, label: "Mother's Day", kind: "holiday" });
      }
      if (c.observesFathersDay) {
        let fd = fathersDay(now.getFullYear());
        if (fd < startOfToday()) fd = fathersDay(now.getFullYear() + 1);
        events.push({ contact: c, date: fd, label: "Father's Day", kind: "holiday" });
      }
    });

    events.sort((a, b) => a.date - b.date);
    return events;
  }
  function startOfToday() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }

  // ============================================================
  // DOM refs
  // ============================================================
  const el = {
    upcomingList: document.getElementById("upcomingList"),
    upcomingCount: document.getElementById("upcomingCount"),
    contactGrid: document.getElementById("contactGrid"),
    relationFilterRow: document.getElementById("relationFilterRow"),
    addContactBtn: document.getElementById("addContactBtn"),
    contactModal: document.getElementById("contactModal"),
    contactModalTitle: document.getElementById("contactModalTitle"),
    contactModalSub: document.getElementById("contactModalSub"),
    closeContactModalBtn: document.getElementById("closeContactModalBtn"),
    contactForm: document.getElementById("contactForm"),
    contactName: document.getElementById("contactName"),
    contactRelation: document.getElementById("contactRelation"),
    contactBirthday: document.getElementById("contactBirthday"),
    contactSpecialDay: document.getElementById("contactSpecialDay"),
    contactSpecialDayLabel: document.getElementById("contactSpecialDayLabel"),
    obsMothersDay: document.getElementById("obsMothersDay"),
    obsFathersDay: document.getElementById("obsFathersDay"),
    contactNotes: document.getElementById("contactNotes"),
    sentimentChooser: document.getElementById("sentimentChooser"),
    deleteContactBtn: document.getElementById("deleteContactBtn"),
    contactPhotosSection: document.getElementById("contactPhotosSection"),
    contactPhotoGrid: document.getElementById("contactPhotoGrid"),
    contactPhotoUploadZone: document.getElementById("contactPhotoUploadZone"),
    contactPhotoInput: document.getElementById("contactPhotoInput"),
    groupPhotoModal: document.getElementById("groupPhotoModal"),
    closeGroupPhotoModalBtn: document.getElementById("closeGroupPhotoModalBtn"),
    groupPhotoUploadZone: document.getElementById("groupPhotoUploadZone"),
    groupPhotoInput: document.getElementById("groupPhotoInput"),
    tagCanvasWrap: document.getElementById("tagCanvasWrap"),
    tagCanvasImg: document.getElementById("tagCanvasImg"),
    tagHint: document.getElementById("tagHint"),
    saveGroupPhotoBtn: document.getElementById("saveGroupPhotoBtn"),
    monitorList: document.getElementById("monitorList"),
    monitorModal: document.getElementById("monitorModal"),
    monitorModalTitle: document.getElementById("monitorModalTitle"),
    monitorModalDesc: document.getElementById("monitorModalDesc"),
    monitorModalLink: document.getElementById("monitorModalLink"),
    closeMonitorModalBtn: document.getElementById("closeMonitorModalBtn"),
    snoozeMonitorBtn: document.getElementById("snoozeMonitorBtn"),
    meSignOutBtn: document.getElementById("meSignOutBtn"),
    meUserAvatar: document.getElementById("meUserAvatar"),
    meUserEmailText: document.getElementById("meUserEmailText"),
    addMentionBtn: document.getElementById("addMentionBtn"),
    mentionFilterRow: document.getElementById("mentionFilterRow"),
    mentionList: document.getElementById("mentionList"),
    mentionModal: document.getElementById("mentionModal"),
    mentionModalTitle: document.getElementById("mentionModalTitle"),
    closeMentionModalBtn: document.getElementById("closeMentionModalBtn"),
    mentionForm: document.getElementById("mentionForm"),
    mentionSource: document.getElementById("mentionSource"),
    mentionDate: document.getElementById("mentionDate"),
    mentionTitle: document.getElementById("mentionTitle"),
    mentionUrl: document.getElementById("mentionUrl"),
    mentionToneChooser: document.getElementById("mentionToneChooser"),
    mentionNotes: document.getElementById("mentionNotes"),
    deleteMentionBtn: document.getElementById("deleteMentionBtn")
  };

  // ============================================================
  // Rendering — upcoming events
  // ============================================================
  function renderUpcoming() {
    const events = computeUpcomingEvents().slice(0, 8);
    el.upcomingCount.textContent = events.length + " in view";
    if (!events.length) {
      el.upcomingList.innerHTML = `<div class="empty-state">No upcoming dates yet. Add a birthday or custom date to a person below.</div>`;
      return;
    }
    el.upcomingList.innerHTML = events.map(ev => {
      const days = daysUntil(ev.date);
      const countdownText = days === 0 ? "Today" : days === 1 ? "1 day" : days + " days";
      const countdownCls = days === 0 ? "today" : "";
      const photo = ev.contact.photos && ev.contact.photos[0];
      const avatar = photo
        ? `<img src="${escapeAttr(photo)}" alt="">`
        : escapeHtml(initials(ev.contact.name));
      const dateLabel = ev.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return `
        <div class="event-row">
          <div class="event-avatar">${avatar}</div>
          <div class="event-info">
            <div class="event-title">${escapeHtml(ev.contact.name)} &mdash; ${escapeHtml(ev.label)}</div>
            <div class="event-meta">${dateLabel}</div>
          </div>
          <div class="event-countdown ${countdownCls} mono">${countdownText}</div>
        </div>`;
    }).join("");
  }

  // ============================================================
  // Rendering — contact grid + filters
  // ============================================================
  function renderRelationFilters() {
    const counts = { all: state.contacts.length };
    state.contacts.forEach(c => { counts[c.relation] = (counts[c.relation] || 0) + 1; });
    const tabs = [["all", "All"], ["family", "Family"], ["friend", "Friend"], ["colleague", "Colleague"], ["other", "Other"]];
    el.relationFilterRow.innerHTML = tabs.map(([key, label]) => {
      const active = state.activeRelationFilter === key ? "active" : "";
      const count = counts[key] || 0;
      return `<button class="filter-chip ${active}" data-relation="${key}">${label}${key !== "all" ? " (" + count + ")" : ""}</button>`;
    }).join("");
    el.relationFilterRow.querySelectorAll(".filter-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeRelationFilter = btn.getAttribute("data-relation");
        renderRelationFilters();
        renderContactGrid();
      });
    });
  }

  function renderContactGrid() {
    const filtered = state.activeRelationFilter === "all"
      ? state.contacts
      : state.contacts.filter(c => c.relation === state.activeRelationFilter);

    if (!filtered.length) {
      el.contactGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">${state.contacts.length ? "No one in this category yet." : "No one added yet — click \u201c+ Add person\u201d to get started."}</div>`;
      return;
    }

    el.contactGrid.innerHTML = filtered.map(c => {
      const photo = c.photos && c.photos[0];
      const avatar = photo ? `<img src="${escapeAttr(photo)}" alt="">` : escapeHtml(initials(c.name));
      const sentimentCls = c.sentiment ? "sentiment-" + c.sentiment : "sentiment-unset";
      const sentimentLabel = c.sentiment ? SENTIMENT_LABELS[c.sentiment] : "Not set";
      const nextEvent = computeUpcomingEvents().find(ev => ev.contact.id === c.id);
      return `
        <div class="contact-card" data-id="${escapeAttr(c.id)}">
          <div class="contact-card-head">
            <div class="contact-avatar">${avatar}</div>
            <div>
              <div class="contact-name">${escapeHtml(c.name)}</div>
              <div class="contact-relation">${escapeHtml(RELATION_LABELS[c.relation] || "Other")}</div>
            </div>
          </div>
          <div class="contact-card-body">
            ${nextEvent ? `<div>${escapeHtml(nextEvent.label)} in ${daysUntil(nextEvent.date)}d</div>` : ""}
            ${c.notes ? `<div style="color:var(--text-faint);">${escapeHtml(c.notes.slice(0, 70))}${c.notes.length > 70 ? "&hellip;" : ""}</div>` : ""}
          </div>
          <span class="sentiment-tag ${sentimentCls}">${escapeHtml(sentimentLabel)}</span>
        </div>`;
    }).join("");

    el.contactGrid.querySelectorAll(".contact-card").forEach(card => {
      card.addEventListener("click", () => openContactModal(card.getAttribute("data-id")));
    });
  }

  // ============================================================
  // Contact modal — add / edit / delete
  // ============================================================
  function resetContactForm() {
    el.contactForm.reset();
    el.contactName.value = "";
    el.contactRelation.value = "family";
    el.contactBirthday.value = "";
    el.contactSpecialDay.value = "";
    el.contactSpecialDayLabel.value = "";
    el.obsMothersDay.checked = false;
    el.obsFathersDay.checked = false;
    el.contactNotes.value = "";
    state.pendingSentiment = "";
    setSentimentChooser("");
  }

  function setSentimentChooser(value) {
    state.pendingSentiment = value;
    el.sentimentChooser.querySelectorAll(".filter-chip").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-sentiment") === value);
    });
  }

  el.sentimentChooser.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => setSentimentChooser(btn.getAttribute("data-sentiment") || ""));
  });

  function openContactModal(contactId) {
    resetContactForm();
    state.editingContactId = contactId || null;

    if (contactId) {
      const c = state.contacts.find(x => x.id === contactId);
      if (!c) return;
      el.contactModalTitle.textContent = c.name;
      el.contactModalSub.style.display = "block";
      el.contactModalSub.textContent = "Added " + new Date(c.createdAt).toLocaleDateString();
      el.contactName.value = c.name;
      el.contactRelation.value = c.relation;
      el.contactBirthday.value = c.birthday || "";
      el.contactSpecialDay.value = c.specialDay || "";
      el.contactSpecialDayLabel.value = c.specialDayLabel || "";
      el.obsMothersDay.checked = !!c.observesMothersDay;
      el.obsFathersDay.checked = !!c.observesFathersDay;
      el.contactNotes.value = c.notes || "";
      setSentimentChooser(c.sentiment || "");
      el.deleteContactBtn.style.display = "inline-flex";
      el.contactPhotosSection.style.display = "block";
      renderContactPhotos(c);
    } else {
      el.contactModalTitle.textContent = "Add person";
      el.contactModalSub.style.display = "none";
      el.deleteContactBtn.style.display = "none";
      el.contactPhotosSection.style.display = "none";
    }

    el.contactModal.classList.add("open");
  }
  function closeContactModal() { el.contactModal.classList.remove("open"); }

  el.addContactBtn.addEventListener("click", () => openContactModal(null));
  el.closeContactModalBtn.addEventListener("click", closeContactModal);
  el.contactModal.addEventListener("click", e => { if (e.target === el.contactModal) closeContactModal(); });

  el.contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = el.contactName.value.trim();
    if (!name) return;

    if (state.editingContactId) {
      const c = state.contacts.find(x => x.id === state.editingContactId);
      if (c) {
        Object.assign(c, {
          name,
          relation: el.contactRelation.value,
          birthday: el.contactBirthday.value,
          specialDay: el.contactSpecialDay.value,
          specialDayLabel: el.contactSpecialDayLabel.value.trim(),
          observesMothersDay: el.obsMothersDay.checked,
          observesFathersDay: el.obsFathersDay.checked,
          notes: el.contactNotes.value,
          sentiment: state.pendingSentiment
        });
      }
    } else {
      state.contacts.push({
        id: uid(),
        name,
        relation: el.contactRelation.value,
        birthday: el.contactBirthday.value,
        specialDay: el.contactSpecialDay.value,
        specialDayLabel: el.contactSpecialDayLabel.value.trim(),
        observesMothersDay: el.obsMothersDay.checked,
        observesFathersDay: el.obsFathersDay.checked,
        notes: el.contactNotes.value,
        sentiment: state.pendingSentiment,
        photos: [],
        createdAt: new Date().toISOString()
      });
    }

    saveContacts(state.contacts);
    closeContactModal();
    renderAll();
  });

  el.deleteContactBtn.addEventListener("click", () => {
    if (!state.editingContactId) return;
    if (!confirm("Remove this person? This deletes their notes and photos too.")) return;
    state.contacts = state.contacts.filter(c => c.id !== state.editingContactId);
    saveContacts(state.contacts);
    closeContactModal();
    renderAll();
  });

  // ---------------- Per-contact photo upload (manual, no tagging needed — it's already linked to this person) ----------------
  function renderContactPhotos(contact) {
    const photos = contact.photos || [];
    if (!photos.length) {
      el.contactPhotoGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1; padding:10px 0;">No photos yet.</div>`;
      return;
    }
    el.contactPhotoGrid.innerHTML = photos.map((src, i) => `
      <div class="photo-thumb" data-index="${i}">
        <img src="${escapeAttr(src)}" alt="">
      </div>`).join("");
    el.contactPhotoGrid.querySelectorAll(".photo-thumb").forEach(thumb => {
      thumb.addEventListener("click", () => {
        const idx = parseInt(thumb.getAttribute("data-index"), 10);
        if (!confirm("Remove this photo?")) return;
        const c = state.contacts.find(x => x.id === state.editingContactId);
        if (!c) return;
        c.photos.splice(idx, 1);
        saveContacts(state.contacts);
        renderContactPhotos(c);
        renderAll();
      });
    });
  }

  el.contactPhotoUploadZone.addEventListener("click", () => el.contactPhotoInput.click());
  el.contactPhotoInput.addEventListener("change", async () => {
    const c = state.contacts.find(x => x.id === state.editingContactId);
    if (!c) return;
    const files = Array.from(el.contactPhotoInput.files || []);
    for (const file of files) {
      try {
        const dataUrl = await fileToDataUrl(file);
        c.photos = c.photos || [];
        c.photos.push(dataUrl);
      } catch (e) { /* skip files that fail to read */ }
    }
    saveContacts(state.contacts);
    renderContactPhotos(c);
    renderAll();
    el.contactPhotoInput.value = "";
  });

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ============================================================
  // Group photo tagging — fully manual. The user draws boxes and
  // types names; nothing is detected or recognized automatically.
  // ============================================================
  let groupPhotoDataUrl = null;
  let dragStart = null;
  let currentBoxEl = null;

  el.groupPhotoUploadZone.addEventListener("click", () => el.groupPhotoInput.click());
  el.groupPhotoInput.addEventListener("change", async () => {
    const file = el.groupPhotoInput.files && el.groupPhotoInput.files[0];
    if (!file) return;
    groupPhotoDataUrl = await fileToDataUrl(file);
    el.tagCanvasImg.src = groupPhotoDataUrl;
    el.tagCanvasWrap.style.display = "block";
    el.tagHint.style.display = "block";
    el.saveGroupPhotoBtn.style.display = "inline-flex";
    state.taggedBoxes = [];
    clearTagBoxes();
  });

  function clearTagBoxes() {
    el.tagCanvasWrap.querySelectorAll(".tag-box").forEach(b => b.remove());
  }

  // Shared by mouse and touch — pulls the pointer position out of
  // whichever event type fired, relative to the canvas wrapper.
  function pointerPos(e) {
    const rect = el.tagCanvasWrap.getBoundingClientRect();
    const point = e.touches && e.touches.length ? e.touches[0] : (e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e);
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  function tagDragStart(e) {
    const targetIsImage = e.target === el.tagCanvasImg;
    if (!targetIsImage) return;
    if (e.cancelable) e.preventDefault(); // stop touch scroll while drawing a box
    dragStart = pointerPos(e);
    currentBoxEl = document.createElement("div");
    currentBoxEl.className = "tag-box";
    currentBoxEl.style.left = dragStart.x + "px";
    currentBoxEl.style.top = dragStart.y + "px";
    currentBoxEl.style.width = "0px";
    currentBoxEl.style.height = "0px";
    el.tagCanvasWrap.appendChild(currentBoxEl);
  }

  function tagDragMove(e) {
    if (!dragStart || !currentBoxEl) return;
    if (e.cancelable) e.preventDefault();
    const p = pointerPos(e);
    const left = Math.min(p.x, dragStart.x), top = Math.min(p.y, dragStart.y);
    const w = Math.abs(p.x - dragStart.x), h = Math.abs(p.y - dragStart.y);
    currentBoxEl.style.left = left + "px"; currentBoxEl.style.top = top + "px";
    currentBoxEl.style.width = w + "px"; currentBoxEl.style.height = h + "px";
  }

  function tagDragEnd() {
    if (!dragStart || !currentBoxEl) return;
    const w = parseFloat(currentBoxEl.style.width), h = parseFloat(currentBoxEl.style.height);
    if (w < 12 || h < 12) { currentBoxEl.remove(); dragStart = null; currentBoxEl = null; return; }
    const rectBox = { left: currentBoxEl.style.left, top: currentBoxEl.style.top, width: currentBoxEl.style.width, height: currentBoxEl.style.height };
    const name = prompt("Who is this? (type a name, or leave blank to skip)");
    if (!name || !name.trim()) { currentBoxEl.remove(); dragStart = null; currentBoxEl = null; return; }
    const labelEl = document.createElement("div");
    labelEl.className = "tag-box-label";
    labelEl.textContent = name.trim();
    currentBoxEl.appendChild(labelEl);
    state.taggedBoxes.push({ name: name.trim(), rect: rectBox });
    dragStart = null; currentBoxEl = null;
  }

  el.tagCanvasWrap.addEventListener("mousedown", tagDragStart);
  el.tagCanvasWrap.addEventListener("mousemove", tagDragMove);
  el.tagCanvasWrap.addEventListener("mouseup", tagDragEnd);
  el.tagCanvasWrap.addEventListener("touchstart", tagDragStart, { passive: false });
  el.tagCanvasWrap.addEventListener("touchmove", tagDragMove, { passive: false });
  el.tagCanvasWrap.addEventListener("touchend", tagDragEnd);

  el.saveGroupPhotoBtn.addEventListener("click", () => {
    if (!groupPhotoDataUrl) return;
    state.groupPhotos.push({
      id: uid(),
      src: groupPhotoDataUrl,
      tags: state.taggedBoxes.slice(),
      createdAt: new Date().toISOString()
    });
    saveGroupPhotos(state.groupPhotos);

    // Offer to link each named tag to an existing contact's photo set,
    // or note it as a name without a contact yet. Purely a convenience —
    // still 100% user-entered data, no recognition involved.
    state.taggedBoxes.forEach(tag => {
      const existing = state.contacts.find(c => c.name.toLowerCase() === tag.name.toLowerCase());
      if (existing) {
        existing.photos = existing.photos || [];
        existing.photos.push(groupPhotoDataUrl);
      }
    });
    saveContacts(state.contacts);

    closeGroupPhotoModal();
    renderAll();
  });

  function closeGroupPhotoModal() {
    document.getElementById("groupPhotoModal").classList.remove("open");
    el.tagCanvasWrap.style.display = "none";
    el.tagHint.style.display = "none";
    el.saveGroupPhotoBtn.style.display = "none";
    clearTagBoxes();
    groupPhotoDataUrl = null;
    state.taggedBoxes = [];
    el.groupPhotoInput.value = "";
  }
  el.closeGroupPhotoModalBtn.addEventListener("click", closeGroupPhotoModal);
  document.getElementById("groupPhotoModal").addEventListener("click", e => {
    if (e.target.id === "groupPhotoModal") closeGroupPhotoModal();
  });

  // ============================================================
  // "Check what's out there" — self-monitoring nudges that link to
  // tools the user runs themselves. This app performs none of the
  // searching; it only reminds and links out.
  // ============================================================
  const MONITOR_ITEMS = [
    {
      id: "google-alert",
      title: "Set a Google Alert for your name",
      desc: "Google emails you when a new page mentioning your name gets indexed. Free, opt-in, and it's Google doing the indexing — not this app searching on your behalf.",
      linkLabel: "Open Google Alerts",
      linkUrl: "https://www.google.com/alerts"
    },
    {
      id: "reverse-image",
      title: "Reverse image search a recent photo of yourself",
      desc: "Upload a photo you control to a reverse image search to see where else it appears online. Run this yourself whenever you're curious — nothing here does it automatically.",
      linkLabel: "Open Google Images",
      linkUrl: "https://images.google.com"
    },
    {
      id: "privacy-checkup",
      title: "Review your social media tag & privacy settings",
      desc: "A periodic check of who can tag you, see your posts, or find your profile is one of the most effective things you can do yourself — far more reliable than any automated scan.",
      linkLabel: null,
      linkUrl: null
    }
  ];

  function renderMonitorList() {
    const monitorState = loadMonitorState();
    el.monitorList.innerHTML = MONITOR_ITEMS.map(item => {
      const snoozedUntil = monitorState[item.id];
      const isSnoozed = snoozedUntil && new Date(snoozedUntil) > new Date();
      const statusText = isSnoozed
        ? "Reminder snoozed until " + new Date(snoozedUntil).toLocaleDateString()
        : "Not done recently";
      return `
        <div class="monitor-row">
          <div class="monitor-info">
            <div class="monitor-title">${escapeHtml(item.title)}</div>
            <div class="monitor-desc">${escapeHtml(statusText)}</div>
          </div>
          <button class="btn btn-ghost btn-sm" data-monitor-id="${escapeAttr(item.id)}">Open</button>
        </div>`;
    }).join("");
    el.monitorList.querySelectorAll("[data-monitor-id]").forEach(btn => {
      btn.addEventListener("click", () => openMonitorModal(btn.getAttribute("data-monitor-id")));
    });
  }

  function openMonitorModal(itemId) {
    const item = MONITOR_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    el.monitorModalTitle.textContent = item.title;
    el.monitorModalDesc.textContent = item.desc;
    el.monitorModalLink.innerHTML = item.linkUrl
      ? `<a href="${escapeAttr(item.linkUrl)}" target="_blank" rel="noopener" class="btn btn-primary" style="display:inline-flex;">${escapeHtml(item.linkLabel)} &rarr;</a>`
      : "";
    el.monitorModal.dataset.itemId = itemId;
    el.monitorModal.classList.add("open");
  }
  function closeMonitorModal() { el.monitorModal.classList.remove("open"); }
  el.closeMonitorModalBtn.addEventListener("click", closeMonitorModal);
  el.monitorModal.addEventListener("click", e => { if (e.target === el.monitorModal) closeMonitorModal(); });

  el.snoozeMonitorBtn.addEventListener("click", () => {
    const itemId = el.monitorModal.dataset.itemId;
    if (!itemId) return;
    const monitorState = loadMonitorState();
    const snoozeUntil = new Date();
    snoozeUntil.setDate(snoozeUntil.getDate() + 90);
    monitorState[itemId] = snoozeUntil.toISOString();
    saveMonitorState(monitorState);
    closeMonitorModal();
    renderMonitorList();
  });

  // ============================================================
  // Mentions — a manual log of things the user found themselves.
  // This app never searches for these; it only stores and organizes
  // what the person already found via Google Alerts, a manual search,
  // or being told by someone else.
  // ============================================================
  const SOURCE_LABELS = {
    "google-alert": "Google Alert",
    "search": "Searched myself",
    "told": "Told by someone",
    "social": "Social media",
    "other": "Other"
  };
  const TONE_LABELS = { positive: "Positive", neutral: "Neutral", negative: "Concerning" };

  function renderMentionFilters() {
    const counts = { all: state.mentions.length };
    state.mentions.forEach(m => { counts[m.tone || "unset"] = (counts[m.tone || "unset"] || 0) + 1; });
    const tabs = [["all", "All"], ["positive", "Positive"], ["neutral", "Neutral"], ["negative", "Concerning"]];
    el.mentionFilterRow.innerHTML = tabs.map(([key, label]) => {
      const active = state.activeMentionFilter === key ? "active" : "";
      const count = counts[key] || 0;
      return `<button class="filter-chip ${active}" data-mention-filter="${key}">${label}${key !== "all" ? " (" + count + ")" : ""}</button>`;
    }).join("");
    el.mentionFilterRow.querySelectorAll("[data-mention-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeMentionFilter = btn.getAttribute("data-mention-filter");
        renderMentionFilters();
        renderMentionList();
      });
    });
  }

  function renderMentionList() {
    const filtered = state.activeMentionFilter === "all"
      ? state.mentions
      : state.mentions.filter(m => (m.tone || "unset") === state.activeMentionFilter);

    const sorted = filtered.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!sorted.length) {
      el.mentionList.innerHTML = `<div class="empty-state">${state.mentions.length ? "Nothing matches this filter." : "Nothing logged yet. When you find something via a Google Alert or a search, log it here so it's all in one place."}</div>`;
      return;
    }

    el.mentionList.innerHTML = sorted.map(m => {
      const toneCls = m.tone || "unset";
      const dateLabel = new Date(m.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return `
        <div class="mention-row" data-id="${escapeAttr(m.id)}">
          <div class="mention-tone-dot ${toneCls}"></div>
          <div class="mention-info">
            <div class="mention-title">${escapeHtml(m.title)}</div>
            <div class="mention-meta">
              ${dateLabel}
              <span class="mention-source-tag">${escapeHtml(SOURCE_LABELS[m.source] || "Other")}</span>
              ${m.url ? `<a href="${escapeAttr(m.url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="margin-left:8px;">Open link &rarr;</a>` : ""}
            </div>
          </div>
        </div>`;
    }).join("");

    el.mentionList.querySelectorAll(".mention-row").forEach(row => {
      row.addEventListener("click", () => openMentionModal(row.getAttribute("data-id")));
    });
  }

  function setMentionToneChooser(value) {
    state.pendingMentionTone = value;
    el.mentionToneChooser.querySelectorAll(".filter-chip").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tone") === value);
    });
  }
  el.mentionToneChooser.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => setMentionToneChooser(btn.getAttribute("data-tone") || ""));
  });

  function resetMentionForm() {
    el.mentionForm.reset();
    el.mentionSource.value = "google-alert";
    el.mentionDate.value = new Date().toISOString().slice(0, 10);
    el.mentionTitle.value = "";
    el.mentionUrl.value = "";
    el.mentionNotes.value = "";
    setMentionToneChooser("");
  }

  function openMentionModal(mentionId) {
    resetMentionForm();
    state.editingMentionId = mentionId || null;

    if (mentionId) {
      const m = state.mentions.find(x => x.id === mentionId);
      if (!m) return;
      el.mentionModalTitle.textContent = "Edit mention";
      el.mentionSource.value = m.source;
      el.mentionDate.value = m.date;
      el.mentionTitle.value = m.title;
      el.mentionUrl.value = m.url || "";
      el.mentionNotes.value = m.notes || "";
      setMentionToneChooser(m.tone || "");
      el.deleteMentionBtn.style.display = "inline-flex";
    } else {
      el.mentionModalTitle.textContent = "Log a mention";
      el.deleteMentionBtn.style.display = "none";
    }

    el.mentionModal.classList.add("open");
  }
  function closeMentionModal() { el.mentionModal.classList.remove("open"); }

  el.addMentionBtn.addEventListener("click", () => openMentionModal(null));
  el.closeMentionModalBtn.addEventListener("click", closeMentionModal);
  el.mentionModal.addEventListener("click", e => { if (e.target === el.mentionModal) closeMentionModal(); });

  el.mentionForm.addEventListener("submit", e => {
    e.preventDefault();
    const title = el.mentionTitle.value.trim();
    if (!title) return;

    if (state.editingMentionId) {
      const m = state.mentions.find(x => x.id === state.editingMentionId);
      if (m) {
        Object.assign(m, {
          source: el.mentionSource.value,
          date: el.mentionDate.value,
          title,
          url: el.mentionUrl.value.trim(),
          tone: state.pendingMentionTone,
          notes: el.mentionNotes.value
        });
      }
    } else {
      state.mentions.push({
        id: uid(),
        source: el.mentionSource.value,
        date: el.mentionDate.value,
        title,
        url: el.mentionUrl.value.trim(),
        tone: state.pendingMentionTone,
        notes: el.mentionNotes.value,
        createdAt: new Date().toISOString()
      });
    }

    saveMentions(state.mentions);
    closeMentionModal();
    renderMentionFilters();
    renderMentionList();
  });

  el.deleteMentionBtn.addEventListener("click", () => {
    if (!state.editingMentionId) return;
    if (!confirm("Delete this logged mention?")) return;
    state.mentions = state.mentions.filter(m => m.id !== state.editingMentionId);
    saveMentions(state.mentions);
    closeMentionModal();
    renderMentionFilters();
    renderMentionList();
  });

  // ============================================================
  // Sign out + user pill
  // ============================================================
  el.meSignOutBtn.addEventListener("click", () => {
    window.AIGMeAuth.logout();
    location.reload();
  });

  function renderUserPill() {
    const user = window.AIGMeAuth.getCurrentUser();
    if (!user) return;
    el.meUserEmailText.textContent = user.email;
    el.meUserAvatar.textContent = user.email.charAt(0).toUpperCase();
  }

  // ============================================================
  // Init
  // ============================================================
  function renderAll() {
    renderUpcoming();
    renderRelationFilters();
    renderContactGrid();
    renderMonitorList();
    renderMentionFilters();
    renderMentionList();
  }

  renderUserPill();
  renderAll();

  // Expose a way to launch the group-photo tagging modal from anywhere
  // (e.g. a future "add group photo" entry point in the contact grid).
  window.AIGMeOpenGroupPhoto = function () {
    document.getElementById("groupPhotoModal").classList.add("open");
  };
})();
