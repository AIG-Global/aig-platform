// ============================================================
// AIG Secure Sign — main app.
//
// Documents are stored in a SINGLE shared localStorage key (not
// per-user-namespaced) so that a signing link opened in a new tab in
// the SAME BROWSER can find the document. This is an honest limitation
// of a backend-less demo, not a design choice I'd recommend for real
// use — signing across different people/devices needs the real
// backend (see backend-example/), which stores documents server-side
// where every party's browser can reach them regardless of device.
// This is stated plainly in the README, not hidden.
// ============================================================

(function () {
  "use strict";

  const DOCS_KEY = "aigsign_documents_v1";
  const PDFJS_VERSION = "3.11.174";

  let pdfjsLoaded = false;
  function ensurePdfJs() {
    if (pdfjsLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.min.js`;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
        pdfjsLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error("Couldn't load the PDF rendering library (pdf.js) — check your connection."));
      document.head.appendChild(script);
    });
  }

  // ============================================================
  // Document storage
  // ============================================================
  function loadAllDocuments() {
    try { return JSON.parse(localStorage.getItem(DOCS_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveAllDocuments(docs) { localStorage.setItem(DOCS_KEY, JSON.stringify(docs)); }
  function getDocument(id) { return loadAllDocuments().find(d => d.id === id) || null; }
  function upsertDocument(doc) {
    const docs = loadAllDocuments();
    const idx = docs.findIndex(d => d.id === doc.id);
    if (idx >= 0) docs[idx] = doc; else docs.push(doc);
    saveAllDocuments(docs);
  }
  function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

  const state = {
    currentUser: null,
    editingDoc: null,
    detailDocId: null,
    fieldColorIndex: {} // signerId -> 1/2/3 for color-coding
  };

  const el = {};
  ["authShell","appShell","authError","loginPanel","registerPanel",
   "navDashboardBtn","navIdentityBtn","userAvatar","userNameText","signOutBtn",
   "globalNotice","dashboardView","docGrid","newDocumentBtn",
   "identityView","identityStatusArea",
   "editorView","docTitleInput","backToDashboardBtn","sendDocumentBtn",
   "uploadPromptArea","uploadDropZone","fileInput","editorWorkArea",
   "assignSignerSelector","pageCanvasContainer","pdfCanvas","signerList","addSignerBtn",
   "detailView","detailTitle","detailStatusBadge","detailBackBtn","detailSignersPanel",
   "auditTable","chainVerifyNotice","verifyChainBtn","certificateLinkSection","viewCertificateLink",
   "signerLinksModal","signerLinksArea","closeSignerLinksBtn","closeSignerLinksBtn2",
   "identitySubmitModal","idType1","idFile1","idType2","idFile2","identitySubmitError","submitIdentityBtn","closeIdentityModalBtn"
  ].forEach(id => { el[id] = document.getElementById(id); });

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function showNotice(html, isError) {
    el.globalNotice.innerHTML = html;
    el.globalNotice.classList.toggle("error", !!isError);
    el.globalNotice.classList.add("show");
  }
  function clearNotice() { el.globalNotice.classList.remove("show"); }

  // ============================================================
  // Auth wiring
  // ============================================================
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach(t => t.classList.toggle("active", t === tab));
      const target = tab.getAttribute("data-tab");
      el.loginPanel.classList.toggle("active", target === "login");
      el.registerPanel.classList.toggle("active", target === "register");
    });
  });
  document.querySelectorAll("[data-switch]").forEach(btn => {
    btn.addEventListener("click", () => document.querySelector(`.auth-tab[data-tab="${btn.getAttribute("data-switch")}"]`).click());
  });

  function showAuthError(msg) { el.authError.textContent = msg; el.authError.classList.add("show"); }
  function clearAuthError() { el.authError.classList.remove("show"); }

  el.loginPanel.addEventListener("submit", async e => {
    e.preventDefault();
    clearAuthError();
    try {
      await window.AIGSignAuth.login({ email: document.getElementById("loginEmail").value, password: document.getElementById("loginPassword").value });
      boot();
    } catch (err) { showAuthError(err.message); }
  });

  el.registerPanel.addEventListener("submit", async e => {
    e.preventDefault();
    clearAuthError();
    try {
      await window.AIGSignAuth.register({
        fullName: document.getElementById("registerFullName").value,
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value
      });
      boot();
    } catch (err) { showAuthError(err.message); }
  });

  el.signOutBtn.addEventListener("click", () => { window.AIGSignAuth.logout(); location.reload(); });

  // ============================================================
  // View switching
  // ============================================================
  function showView(name) {
    ["dashboardView", "identityView", "editorView", "detailView"].forEach(v => {
      el[v].style.display = v === name ? "block" : "none";
    });
  }

  el.navDashboardBtn.addEventListener("click", () => { showView("dashboardView"); renderDashboard(); });
  el.navIdentityBtn.addEventListener("click", () => { showView("identityView"); renderIdentityView(); });
  el.detailBackBtn.addEventListener("click", () => { showView("dashboardView"); renderDashboard(); });
  el.backToDashboardBtn.addEventListener("click", () => { showView("dashboardView"); renderDashboard(); });

  // ============================================================
  // Dashboard
  // ============================================================
  function renderDashboard() {
    const docs = loadAllDocuments().filter(d => d.ownerEmail === state.currentUser.email);
    if (!docs.length) {
      el.docGrid.innerHTML = `<div style="grid-column:1/-1; color:var(--text-faint); text-align:center; padding:40px 0;">No documents yet. Click "+ New document" to send your first one.</div>`;
      return;
    }
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    el.docGrid.innerHTML = docs.map(d => {
      const signedCount = d.signers.filter(s => s.status === "signed").length;
      return `
        <div class="doc-card" data-id="${escapeHtml(d.id)}">
          <div class="doc-card-title">${escapeHtml(d.title || "Untitled document")}</div>
          <div class="doc-card-meta">Created ${new Date(d.createdAt).toLocaleDateString()}</div>
          <span class="status-badge status-${d.status}">${d.status.replace("_", " ")}</span>
          <div class="doc-card-signers" style="margin-top:10px;">${signedCount} / ${d.signers.length} signed</div>
        </div>`;
    }).join("");
    el.docGrid.querySelectorAll(".doc-card").forEach(card => {
      card.addEventListener("click", () => openDetail(card.getAttribute("data-id")));
    });
  }

  el.newDocumentBtn.addEventListener("click", () => {
    state.editingDoc = {
      id: uid(),
      ownerEmail: state.currentUser.email,
      title: "",
      pdfDataUrl: null,
      fileHash: null,
      fields: [],
      signers: [],
      status: "draft",
      auditChain: [],
      createdAt: new Date().toISOString()
    };
    el.docTitleInput.value = "";
    el.uploadPromptArea.style.display = "block";
    el.editorWorkArea.style.display = "none";
    showView("editorView");
  });

  // ============================================================
  // PDF upload + rendering
  // ============================================================
  el.uploadDropZone.addEventListener("click", () => el.fileInput.click());
  el.uploadDropZone.addEventListener("dragover", e => { e.preventDefault(); el.uploadDropZone.style.borderColor = "var(--amber)"; });
  el.uploadDropZone.addEventListener("dragleave", () => { el.uploadDropZone.style.borderColor = ""; });
  el.uploadDropZone.addEventListener("drop", e => {
    e.preventDefault();
    el.uploadDropZone.style.borderColor = "";
    if (e.dataTransfer.files[0]) handlePdfUpload(e.dataTransfer.files[0]);
  });
  el.fileInput.addEventListener("change", () => { if (el.fileInput.files[0]) handlePdfUpload(el.fileInput.files[0]); });

  async function handlePdfUpload(file) {
    if (file.type !== "application/pdf") { showNotice("<b>Only PDF files are supported.</b>", true); return; }
    try {
      await ensurePdfJs();
      const buffer = await file.arrayBuffer();
      const hash = await window.AIGSignCrypto.sha256Hex(buffer);
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      state.editingDoc.pdfDataUrl = dataUrl;
      state.editingDoc.fileHash = hash;
      state.editingDoc.title = state.editingDoc.title || file.name.replace(/\.pdf$/i, "");
      el.docTitleInput.value = state.editingDoc.title;

      await window.AIGSignCrypto.appendAuditEvent(state.editingDoc.auditChain, {
        action: "document_uploaded", actor: state.currentUser.email, fileHash: hash, fileName: file.name
      });

      await renderPdfPage(buffer);
      el.uploadPromptArea.style.display = "none";
      el.editorWorkArea.style.display = "block";
      if (!state.editingDoc.signers.length) addSigner();
      renderSignerList();
      renderAssignSelector();
    } catch (e) {
      showNotice("<b>Couldn't process that PDF:</b> " + escapeHtml(e.message), true);
    }
  }

  async function renderPdfPage(bufferOrDataUrl) {
    const data = bufferOrDataUrl instanceof ArrayBuffer ? new Uint8Array(bufferOrDataUrl) : bufferOrDataUrl;
    const pdf = await window.pdfjsLib.getDocument({ data }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    el.pdfCanvas.width = viewport.width;
    el.pdfCanvas.height = viewport.height;
    el.pageCanvasContainer.style.width = viewport.width + "px";
    await page.render({ canvasContext: el.pdfCanvas.getContext("2d"), viewport }).promise;
    renderPlacedFields();
  }

  // ============================================================
  // Signers
  // ============================================================
  function addSigner() {
    state.editingDoc.signers.push({ id: uid(), name: "", email: "", order: state.editingDoc.signers.length, status: "pending" });
  }
  el.addSignerBtn.addEventListener("click", () => { addSigner(); renderSignerList(); renderAssignSelector(); });

  function renderSignerList() {
    el.signerList.innerHTML = state.editingDoc.signers.map((s, i) => `
      <div class="signer-item" data-id="${s.id}">
        <div style="font-size:11px; color:var(--text-faint); margin-bottom:6px;"><span class="signer-color-dot signer-color-${(i % 3) + 1}"></span>Signer ${i + 1}</div>
        <input type="text" placeholder="Full name" class="signer-name-input" value="${escapeHtml(s.name)}">
        <input type="email" placeholder="Email" class="signer-email-input" value="${escapeHtml(s.email)}">
        ${state.editingDoc.signers.length > 1 ? `<button class="btn btn-ghost btn-sm" style="margin-top:4px;" data-remove="${s.id}">Remove</button>` : ""}
      </div>`).join("");

    el.signerList.querySelectorAll(".signer-item").forEach(item => {
      const id = item.getAttribute("data-id");
      item.querySelector(".signer-name-input").addEventListener("input", e => {
        state.editingDoc.signers.find(s => s.id === id).name = e.target.value;
        renderAssignSelector();
      });
      item.querySelector(".signer-email-input").addEventListener("input", e => {
        state.editingDoc.signers.find(s => s.id === id).email = e.target.value;
      });
      const removeBtn = item.querySelector("[data-remove]");
      if (removeBtn) removeBtn.addEventListener("click", () => {
        state.editingDoc.signers = state.editingDoc.signers.filter(s => s.id !== id);
        state.editingDoc.fields = state.editingDoc.fields.filter(f => f.assignedSignerId !== id);
        renderSignerList(); renderAssignSelector(); renderPlacedFields();
      });
    });
  }

  let activeAssignedSignerId = null;
  function renderAssignSelector() {
    if (!state.editingDoc.signers.length) { el.assignSignerSelector.innerHTML = ""; return; }
    if (!activeAssignedSignerId || !state.editingDoc.signers.some(s => s.id === activeAssignedSignerId)) {
      activeAssignedSignerId = state.editingDoc.signers[0].id;
    }
    el.assignSignerSelector.innerHTML = state.editingDoc.signers.map((s, i) => `
      <label style="display:flex; align-items:center; gap:6px; font-size:12.5px; margin-bottom:6px; cursor:pointer;">
        <input type="radio" name="assignSigner" value="${s.id}" ${s.id === activeAssignedSignerId ? "checked" : ""} style="width:auto;">
        <span class="signer-color-dot signer-color-${(i % 3) + 1}"></span>${escapeHtml(s.name || "Signer " + (i + 1))}
      </label>`).join("");
    el.assignSignerSelector.querySelectorAll("input[name=assignSigner]").forEach(r => {
      r.addEventListener("change", () => { activeAssignedSignerId = r.value; });
    });
  }

  // ============================================================
  // Field placement — drag from palette, drop onto canvas.
  //
  // Two independent input paths, because native HTML5 drag-and-drop
  // (draggable="true" + dragstart/drop) does NOT fire from touch
  // gestures on mobile browsers — this is standard, well-documented
  // browser behavior, not a bug to work around in one browser. Mouse
  // users get the native HTML5 DnD path; touch users get a manual
  // touch-tracking path below that achieves the same result. Both
  // funnel into the same placeField() function so the actual placement
  // logic only exists once.
  // ============================================================
  function placeField(fieldType, clientX, clientY) {
    if (!activeAssignedSignerId) { showNotice("<b>Add a signer first.</b>", true); return; }
    const rect = el.pageCanvasContainer.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const defaultSizes = { signature: [140, 40], initial: [60, 40], date: [100, 30], text: [140, 30], checkbox: [24, 24] };
    const [w, h] = defaultSizes[fieldType] || [100, 30];
    state.editingDoc.fields.push({
      id: uid(), type: fieldType, assignedSignerId: activeAssignedSignerId,
      xPct: (x - w / 2) / rect.width, yPct: (y - h / 2) / rect.height,
      wPct: w / rect.width, hPct: h / rect.height, value: null
    });
    renderPlacedFields();
  }

  document.querySelectorAll(".field-palette-item").forEach(item => {
    item.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/field-type", item.getAttribute("data-field-type"));
    });
  });
  el.pageCanvasContainer.addEventListener("dragover", e => e.preventDefault());
  el.pageCanvasContainer.addEventListener("drop", e => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData("text/field-type");
    if (fieldType) placeField(fieldType, e.clientX, e.clientY);
  });

  // Touch path: track which palette item a touch started on, follow the
  // finger with a small ghost indicator, and on release check whether
  // the finger is over the canvas — if so, place the field there.
  let touchDragFieldType = null;
  let touchGhostEl = null;

  document.querySelectorAll(".field-palette-item").forEach(item => {
    item.addEventListener("touchstart", e => {
      touchDragFieldType = item.getAttribute("data-field-type");
      touchGhostEl = document.createElement("div");
      touchGhostEl.style.position = "fixed";
      touchGhostEl.style.zIndex = "999";
      touchGhostEl.style.pointerEvents = "none";
      touchGhostEl.style.padding = "6px 10px";
      touchGhostEl.style.background = "var(--amber)";
      touchGhostEl.style.color = "#1a1206";
      touchGhostEl.style.borderRadius = "5px";
      touchGhostEl.style.fontSize = "11px";
      touchGhostEl.style.fontWeight = "600";
      touchGhostEl.textContent = item.textContent.trim();
      document.body.appendChild(touchGhostEl);
      const t = e.touches[0];
      touchGhostEl.style.left = (t.clientX - 20) + "px";
      touchGhostEl.style.top = (t.clientY - 16) + "px";
    }, { passive: true });
  });

  document.addEventListener("touchmove", e => {
    if (!touchDragFieldType || !touchGhostEl) return;
    const t = e.touches[0];
    touchGhostEl.style.left = (t.clientX - 20) + "px";
    touchGhostEl.style.top = (t.clientY - 16) + "px";
  }, { passive: true });

  document.addEventListener("touchend", e => {
    if (!touchDragFieldType) return;
    const t = e.changedTouches[0];
    const rect = el.pageCanvasContainer.getBoundingClientRect();
    const overCanvas = t.clientX >= rect.left && t.clientX <= rect.right && t.clientY >= rect.top && t.clientY <= rect.bottom;
    if (overCanvas) placeField(touchDragFieldType, t.clientX, t.clientY);
    if (touchGhostEl) { touchGhostEl.remove(); touchGhostEl = null; }
    touchDragFieldType = null;
  });

  const FIELD_LABELS = { signature: "Sign", initial: "Init", date: "Date", text: "Text", checkbox: "\u2713" };
  function renderPlacedFields() {
    el.pageCanvasContainer.querySelectorAll(".placed-field").forEach(f => f.remove());
    const rect = el.pageCanvasContainer.getBoundingClientRect();
    state.editingDoc.fields.forEach(f => {
      const signerIdx = state.editingDoc.signers.findIndex(s => s.id === f.assignedSignerId);
      const div = document.createElement("div");
      div.className = "placed-field signer-" + ((signerIdx % 3) + 1);
      div.style.left = (f.xPct * rect.width) + "px";
      div.style.top = (f.yPct * rect.height) + "px";
      div.style.width = (f.wPct * rect.width) + "px";
      div.style.height = (f.hPct * rect.height) + "px";
      div.textContent = FIELD_LABELS[f.type] || f.type;
      const removeBtn = document.createElement("div");
      removeBtn.className = "field-remove";
      removeBtn.textContent = "\u00d7";
      removeBtn.addEventListener("click", ev => {
        ev.stopPropagation();
        state.editingDoc.fields = state.editingDoc.fields.filter(x => x.id !== f.id);
        renderPlacedFields();
      });
      div.appendChild(removeBtn);
      el.pageCanvasContainer.appendChild(div);
    });
  }

  el.docTitleInput.addEventListener("input", () => { state.editingDoc.title = el.docTitleInput.value; });

  // ============================================================
  // Send for signature
  // ============================================================
  el.sendDocumentBtn.addEventListener("click", async () => {
    const doc = state.editingDoc;
    if (!doc || !doc.pdfDataUrl) { showNotice("<b>Upload a PDF first.</b>", true); return; }
    if (!doc.fields.length) { showNotice("<b>Add at least one field for a signer to fill.</b>", true); return; }
    const missingInfo = doc.signers.some(s => !s.name.trim() || !s.email.trim());
    if (missingInfo) { showNotice("<b>Every signer needs a name and email.</b>", true); return; }

    doc.signers.forEach(s => { s.token = uid() + uid(); s.status = "pending"; });
    doc.status = "sent";
    doc.sentAt = new Date().toISOString();

    await window.AIGSignCrypto.appendAuditEvent(doc.auditChain, {
      action: "document_sent", actor: state.currentUser.email,
      signerEmails: doc.signers.map(s => s.email)
    });

    upsertDocument(doc);
    showSignerLinksModal(doc);
  });

  function showSignerLinksModal(doc) {
    const base = location.origin + location.pathname.replace(/index\.html$/, "");
    el.signerLinksArea.innerHTML = doc.signers.map((s, i) => {
      const link = base + "sign.html?doc=" + doc.id + "&signer=" + s.id + "&token=" + s.token;
      return `
        <div style="margin-bottom:12px;">
          <div style="font-size:12.5px; font-weight:600;">${escapeHtml(s.name)} <span style="color:var(--text-faint); font-weight:400;">(${escapeHtml(s.email)})</span></div>
          <div class="link-row">
            <input type="text" readonly value="${escapeHtml(link)}" class="mono">
            <button class="btn btn-ghost btn-sm" data-copy="${escapeHtml(link)}">Copy</button>
          </div>
        </div>`;
    }).join("");
    el.signerLinksArea.querySelectorAll("[data-copy]").forEach(btn => {
      btn.addEventListener("click", async () => {
        await navigator.clipboard.writeText(btn.getAttribute("data-copy")).catch(() => {});
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = "Copy"; }, 1500);
      });
    });
    el.signerLinksModal.classList.add("show");
  }
  function closeSignerLinksModal() {
    el.signerLinksModal.classList.remove("show");
    showView("dashboardView");
    renderDashboard();
  }
  el.closeSignerLinksBtn.addEventListener("click", closeSignerLinksModal);
  el.closeSignerLinksBtn2.addEventListener("click", closeSignerLinksModal);

  // ============================================================
  // Document detail / tracking view
  // ============================================================
  function openDetail(docId) {
    state.detailDocId = docId;
    const doc = getDocument(docId);
    if (!doc) return;
    el.detailTitle.textContent = doc.title || "Untitled document";
    el.detailStatusBadge.className = "status-badge status-" + doc.status;
    el.detailStatusBadge.textContent = doc.status.replace("_", " ");

    el.detailSignersPanel.innerHTML = doc.signers.map((s, i) => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 0; ${i > 0 ? "border-top:1px solid var(--line);" : ""}">
        <div>
          <div style="font-size:13px; font-weight:600;"><span class="signer-color-dot signer-color-${(i % 3) + 1}"></span>${escapeHtml(s.name)}</div>
          <div style="font-size:11.5px; color:var(--text-faint);">${escapeHtml(s.email)}${s.signedAt ? " \u00b7 signed " + new Date(s.signedAt).toLocaleString() : ""}</div>
        </div>
        <span class="status-badge status-${s.status === "signed" ? "completed" : s.status === "viewed" ? "viewed" : "sent"}">${s.status}</span>
      </div>`).join("");

    renderAuditTable(doc);
    el.chainVerifyNotice.classList.remove("show");

    if (doc.status === "completed") {
      el.certificateLinkSection.style.display = "block";
      el.viewCertificateLink.href = "certificate.html?doc=" + doc.id;
    } else {
      el.certificateLinkSection.style.display = "none";
    }

    showView("detailView");
  }

  function renderAuditTable(doc) {
    el.auditTable.innerHTML = `
      <tr><th>#</th><th>Action</th><th>Actor</th><th>Timestamp</th><th>Hash</th></tr>
      ${doc.auditChain.map(ev => `
        <tr>
          <td>${ev.sequence}</td>
          <td class="action-cell">${escapeHtml(ev.action.replace(/_/g, " "))}</td>
          <td>${escapeHtml(ev.actor || "\u2014")}</td>
          <td>${new Date(ev.timestamp).toLocaleString()}</td>
          <td><span class="hash-chip">${ev.hash.slice(0, 12)}\u2026</span></td>
        </tr>`).join("")}`;
  }

  el.verifyChainBtn.addEventListener("click", async () => {
    const doc = getDocument(state.detailDocId);
    const result = await window.AIGSignCrypto.verifyAuditChain(doc.auditChain);
    el.chainVerifyNotice.classList.add("show");
    el.chainVerifyNotice.classList.toggle("error", !result.valid);
    el.chainVerifyNotice.innerHTML = result.valid
      ? "<b>Chain verified.</b> Every event's hash was independently recomputed and matches — nothing in this document's history has been altered since it was recorded."
      : "<b>Chain broken at event #" + result.brokenAtIndex + ".</b> This audit trail does not verify — something was altered after the fact.";
  });

  // ============================================================
  // Identity verification view
  // ============================================================
  function renderIdentityView() {
    const record = window.AIGSignAuth.getUserRecord(state.currentUser.email);
    const iv = record ? record.identityVerification : { status: "not_started" };
    const label = window.AIGSignKYC.statusLabel(iv);
    const providerConfigured = window.AIGSignKYC.isProviderConfigured();

    let bodyHtml = `<div style="font-size:13px; margin-bottom:14px;">Status: <b>${escapeHtml(label)}</b></div>`;
    if (!providerConfigured) {
      bodyHtml += `<div class="disclaimer-banner"><b>No identity verification provider is connected.</b> Documents you upload here are hashed and their metadata recorded, but this is a self-declaration, not verified identity. See kyc.js for how to connect a real provider (Persona, Onfido, Stripe Identity, Jumio).</div>`;
    }
    if (iv.documents) {
      bodyHtml += `<div style="margin-top:14px;"><div class="section-title">Documents on file (hash only \u2014 no image stored)</div>`
        + iv.documents.map(d => `<div style="font-size:12px; color:var(--text-dim); margin-bottom:6px;">${escapeHtml(d.type.replace("_"," "))} \u2014 <span class="hash-chip">${d.sha256.slice(0,16)}\u2026</span> \u00b7 ${escapeHtml(d.fileName)}</div>`).join("")
        + `</div>`;
    }
    bodyHtml += `<button class="btn btn-primary btn-sm" id="openIdentityModalBtn" style="margin-top:14px;">${iv.documents ? "Resubmit documents" : "Provide identification"}</button>`;
    el.identityStatusArea.innerHTML = bodyHtml;
    document.getElementById("openIdentityModalBtn").addEventListener("click", () => el.identitySubmitModal.classList.add("show"));
  }

  el.closeIdentityModalBtn.addEventListener("click", () => el.identitySubmitModal.classList.remove("show"));
  el.submitIdentityBtn.addEventListener("click", async () => {
    el.identitySubmitError.classList.remove("show");
    try {
      await window.AIGSignKYC.submitSelfDeclaredIdentity(
        state.currentUser.email,
        el.idFile1.files[0], el.idType1.value,
        el.idFile2.files[0], el.idType2.value
      );
      el.identitySubmitModal.classList.remove("show");
      renderIdentityView();
    } catch (e) {
      el.identitySubmitError.textContent = e.message;
      el.identitySubmitError.classList.add("show");
    }
  });

  // ============================================================
  // Boot
  // ============================================================
  function boot() {
    const user = window.AIGSignAuth.getCurrentUser();
    if (!user) { el.authShell.style.display = "flex"; el.appShell.style.display = "none"; return; }
    state.currentUser = user;
    el.authShell.style.display = "none";
    el.appShell.style.display = "block";
    el.userAvatar.textContent = (user.fullName || user.email).charAt(0).toUpperCase();
    el.userNameText.textContent = user.fullName || user.email;
    showView("dashboardView");
    renderDashboard();
  }

  boot();
})();
