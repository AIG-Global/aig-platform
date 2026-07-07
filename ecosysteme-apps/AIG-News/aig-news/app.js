// ============================================================
// AIG News — fetches real RSS feeds from 15 outlets via a public CORS
// proxy (browsers block direct cross-origin RSS fetches), parses them,
// auto-categorizes headlines by keyword matching, and renders a
// filterable grid. Each outlet is fetched independently so one feed
// failing (down, rate-limited, changed its URL) never blocks the rest —
// the UI reports per-outlet status rather than failing silently or
// failing everything together.
// ============================================================

(function () {
  "use strict";

  const RSS_PROXY = "https://api.allorigins.win/raw?url=";
  const { OUTLETS, categorize } = window.AIGNewsData;

  const state = {
    activeSet: "world",   // "world" or "money" — which outlet collection + topic scheme is active
    articles: [],         // flattened, normalized articles from the CURRENT set's outlets only
    videos: [],           // flattened video entries from outlets with a verified YouTube channel ID
    outletStatus: {},     // id -> { state: 'pending'|'ok'|'error', count, error }
    activeTopic: "all",
    activeRegion: "all",
    activeSource: "all",
    searchQuery: "",
    sortMode: "newest"
  };

  function outletsForActiveSet() {
    return OUTLETS.filter(o => o.set === state.activeSet || o.set === "both");
  }

  const el = {
    feedStatusLed: document.getElementById("feedStatusLed"),
    feedStatusText: document.getElementById("feedStatusText"),
    refreshBtn: document.getElementById("refreshBtn"),
    noticeBanner: document.getElementById("noticeBanner"),
    outletPanelHead: document.getElementById("outletPanelHead"),
    outletPanelTitle: document.getElementById("outletPanelTitle"),
    outletPanelToggle: document.getElementById("outletPanelToggle"),
    outletStatusGrid: document.getElementById("outletStatusGrid"),
    setSwitchRow: document.getElementById("setSwitchRow"),
    searchInput: document.getElementById("searchInput"),
    topicFilterRow: document.getElementById("topicFilterRow"),
    regionFilterRow: document.getElementById("regionFilterRow"),
    sourceFilterRow: document.getElementById("sourceFilterRow"),
    resultCount: document.getElementById("resultCount"),
    sortSelect: document.getElementById("sortSelect"),
    articleGrid: document.getElementById("articleGrid"),
    videoGrid: document.getElementById("videoGrid"),
    videoNotice: document.getElementById("videoNotice")
  };

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function escapeAttr(s) { return String(s == null ? "" : s).replace(/"/g, "&quot;"); }

  function showNotice(html) {
    el.noticeBanner.innerHTML = html;
    el.noticeBanner.classList.add("show");
  }

  // ============================================================
  // Fetch + parse a single outlet's RSS feed.
  // ============================================================
  async function fetchOutletFeed(outlet) {
    const targetUrl = outlet.feedUrl;
    const res = await fetch(RSS_PROXY + encodeURIComponent(targetUrl));
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");

    if (xml.querySelector("parsererror")) throw new Error("Feed did not parse as valid XML/RSS");

    const items = Array.from(xml.querySelectorAll("item")).slice(0, 20);
    if (!items.length) throw new Error("Feed returned no items");

    return items.map(item => {
      const title = textOf(item, "title");
      const link = textOf(item, "link");
      const description = stripHtml(textOf(item, "description") || textOf(item, "summary"));
      const pubDate = textOf(item, "pubDate") || textOf(item, "published") || textOf(item, "updated");
      return {
        id: outlet.id + "::" + (link || title),
        outletId: outlet.id,
        outletName: outlet.name,
        region: outlet.region,
        title: title || "(untitled)",
        link: link || outlet.siteUrl,
        description: description || "",
        pubDate: pubDate ? new Date(pubDate) : null,
        topics: categorize(title + " " + description, outlet.set === "both" ? state.activeSet : outlet.set)
      };
    });
  }

  function textOf(item, tag) {
    const node = item.querySelector(tag);
    return node ? node.textContent.trim() : "";
  }
  function stripHtml(s) {
    if (!s) return "";
    const d = document.createElement("div");
    d.innerHTML = s;
    return (d.textContent || "").trim();
  }

  // ============================================================
  // YouTube videos — fetched from each outlet's official channel RSS
  // feed (https://www.youtube.com/feeds/videos.xml?channel_id=...),
  // which is real, public, undocumented-but-stable YouTube
  // infrastructure requiring no API key. Embeds use YouTube's own
  // iframe player, so playback, ads, and view-counting all happen on
  // YouTube's side exactly as if watched there directly.
  //
  // Outlets without a channel ID I could independently VERIFY (by
  // resolving to a real youtube.com/channel/UC... URL, not a guess or
  // a truncated directory listing) are simply skipped here rather than
  // risk embedding the wrong channel under a trusted outlet's name.
  // ============================================================
  async function fetchOutletVideos(outlet) {
    if (!outlet.youtubeChannelId) return [];
    const feedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=" + outlet.youtubeChannelId;
    const res = await fetch(RSS_PROXY + encodeURIComponent(feedUrl));
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    if (xml.querySelector("parsererror")) throw new Error("YouTube feed did not parse");

    const entries = Array.from(xml.querySelectorAll("entry")).slice(0, 6);
    return entries.map(entry => {
      const videoId = textOf(entry, "yt\\:videoId") || extractVideoIdFromLink(entry);
      const title = textOf(entry, "title");
      const published = textOf(entry, "published");
      const thumbNode = entry.querySelector("media\\:thumbnail, thumbnail");
      const thumbUrl = thumbNode ? thumbNode.getAttribute("url") : (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);
      return {
        id: outlet.id + "::yt::" + videoId,
        outletId: outlet.id,
        outletName: outlet.name,
        videoId,
        title: title || "(untitled video)",
        publishedAt: published ? new Date(published) : null,
        thumbUrl,
        watchUrl: videoId ? "https://www.youtube.com/watch?v=" + videoId : outlet.siteUrl
      };
    }).filter(v => v.videoId);
  }

  function extractVideoIdFromLink(entry) {
    const link = entry.querySelector("link");
    const href = link ? link.getAttribute("href") : "";
    const match = href.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  }

  // ============================================================
  // Load all outlets in parallel, independently.
  // ============================================================
  async function loadAllFeeds() {
    const outlets = outletsForActiveSet();
    state.articles = [];
    state.videos = [];
    state.outletStatus = {};
    outlets.forEach(o => { state.outletStatus[o.id] = { state: "pending", count: 0 }; });
    el.outletPanelTitle.textContent = "Outlets \u2014 " + outlets.length + " sources";
    renderOutletStatus();
    setOverallStatus("pending", "loading " + outlets.length + " feeds\u2026");
    el.articleGrid.innerHTML = `<div class="loading-state">Loading headlines from ${outlets.length} outlets&hellip;</div>`;
    renderVideos(); // shows the "loading" / "no videos yet" state immediately

    const results = await Promise.allSettled(outlets.map(o => fetchOutletFeed(o)));

    results.forEach((result, idx) => {
      const outlet = outlets[idx];
      if (result.status === "fulfilled") {
        state.articles.push(...result.value);
        state.outletStatus[outlet.id] = { state: "ok", count: result.value.length };
      } else {
        state.outletStatus[outlet.id] = { state: "error", count: 0, error: result.reason ? result.reason.message : "Unknown error" };
      }
    });

    const okCount = Object.values(state.outletStatus).filter(s => s.state === "ok").length;
    const errorCount = outlets.length - okCount;

    if (okCount === 0) {
      setOverallStatus("error", "all feeds failed");
      showNotice(`<b>No feeds loaded.</b> This usually means the public CORS proxy (allorigins.win) is rate-limited or temporarily down — it has no SLA. Try "refresh all" in a minute, or check the per-outlet status panel above for specific errors.`);
    } else if (errorCount > 0) {
      setOverallStatus("partial", okCount + "/" + outlets.length + " feeds live");
      showNotice(`<b>${errorCount} of ${outlets.length} outlets didn't load this time</b> (rate limits or feed changes are the usual cause — see the status panel above for which ones and why). Showing headlines from the ${okCount} that did.`);
    } else {
      setOverallStatus("live", "all " + outlets.length + " feeds live");
      el.noticeBanner.classList.remove("show");
    }

    renderOutletStatus();
    renderFilters();
    renderArticles();

    // Videos load separately and don't affect the overall feed status —
    // most outlets simply don't have a verified channel ID yet, which is
    // an expected, normal state, not an error.
    const videoOutlets = outlets.filter(o => o.youtubeChannelId);
    if (videoOutlets.length) {
      const videoResults = await Promise.allSettled(videoOutlets.map(o => fetchOutletVideos(o)));
      videoResults.forEach(result => {
        if (result.status === "fulfilled") state.videos.push(...result.value);
      });
      state.videos.sort((a, b) => (b.publishedAt ? b.publishedAt.getTime() : 0) - (a.publishedAt ? a.publishedAt.getTime() : 0));
    }
    renderVideos();
  }

  function setOverallStatus(stateName, text) {
    el.feedStatusLed.classList.remove("live", "partial", "error");
    if (stateName !== "pending") el.feedStatusLed.classList.add(stateName);
    el.feedStatusText.textContent = text;
  }

  // ============================================================
  // Outlet status panel (collapsible)
  // ============================================================
  function renderOutletStatus() {
    const outlets = outletsForActiveSet();
    el.outletStatusGrid.innerHTML = outlets.map(o => {
      const s = state.outletStatus[o.id] || { state: "pending" };
      const ledClass = s.state === "ok" ? "live" : s.state === "error" ? "error" : "";
      const label = s.state === "ok" ? s.count + " headlines"
        : s.state === "error" ? (s.error || "error")
        : "loading\u2026";
      return `
        <div class="outlet-status-row">
          <span class="outlet-status-name">${escapeHtml(o.name)}</span>
          <span class="outlet-status-count"><span class="status-led ${ledClass}" style="display:inline-block; margin-right:5px;"></span>${escapeHtml(label)}</span>
        </div>`;
    }).join("");
  }

  let outletPanelOpen = false;
  el.outletPanelHead.addEventListener("click", () => {
    outletPanelOpen = !outletPanelOpen;
    el.outletStatusGrid.style.display = outletPanelOpen ? "grid" : "none";
    el.outletPanelToggle.textContent = outletPanelOpen ? "hide status \u2191" : "show status \u2193";
  });

  // ============================================================
  // Filters
  // ============================================================
  function renderFilters() {
    const outlets = outletsForActiveSet();
    const topicScheme = window.AIGNewsData.TOPIC_SCHEMES[state.activeSet];
    const topics = ["all", ...Object.keys(topicScheme), "General"];
    const topicCounts = countBy(state.articles, a => a.topics);
    el.topicFilterRow.innerHTML = topics.map(t => {
      const active = state.activeTopic === t ? "active" : "";
      const count = t === "all" ? state.articles.length : (topicCounts[t] || 0);
      return `<button class="filter-chip ${active}" data-topic="${escapeAttr(t)}">${t === "all" ? "All" : escapeHtml(t)} (${count})</button>`;
    }).join("");

    const regions = ["all", ...new Set(outlets.map(o => o.region))];
    el.regionFilterRow.innerHTML = regions.map(r => {
      const active = state.activeRegion === r ? "active" : "";
      return `<button class="filter-chip ${active}" data-region="${escapeAttr(r)}">${r === "all" ? "All" : escapeHtml(r)}</button>`;
    }).join("");

    el.sourceFilterRow.innerHTML = ["all", ...outlets.map(o => o.id)].map(id => {
      const active = state.activeSource === id ? "active" : "";
      const label = id === "all" ? "All" : outlets.find(o => o.id === id).name;
      const count = id === "all" ? state.articles.length : state.articles.filter(a => a.outletId === id).length;
      return `<button class="filter-chip ${active}" data-source="${escapeAttr(id)}">${escapeHtml(label)} (${count})</button>`;
    }).join("");

    el.topicFilterRow.querySelectorAll("[data-topic]").forEach(btn => {
      btn.addEventListener("click", () => { state.activeTopic = btn.getAttribute("data-topic"); renderFilters(); renderArticles(); });
    });
    el.regionFilterRow.querySelectorAll("[data-region]").forEach(btn => {
      btn.addEventListener("click", () => { state.activeRegion = btn.getAttribute("data-region"); renderFilters(); renderArticles(); });
    });
    el.sourceFilterRow.querySelectorAll("[data-source]").forEach(btn => {
      btn.addEventListener("click", () => { state.activeSource = btn.getAttribute("data-source"); renderFilters(); renderArticles(); });
    });
  }

  function countBy(articles, getTopics) {
    const counts = {};
    articles.forEach(a => { getTopics(a).forEach(t => { counts[t] = (counts[t] || 0) + 1; }); });
    return counts;
  }

  el.searchInput.addEventListener("input", () => {
    state.searchQuery = el.searchInput.value.trim().toLowerCase();
    renderArticles();
  });
  el.sortSelect.addEventListener("change", () => {
    state.sortMode = el.sortSelect.value;
    renderArticles();
  });
  el.refreshBtn.addEventListener("click", loadAllFeeds);

  el.setSwitchRow.querySelectorAll("[data-set]").forEach(btn => {
    btn.addEventListener("click", () => {
      const newSet = btn.getAttribute("data-set");
      if (newSet === state.activeSet) return;
      state.activeSet = newSet;
      state.activeTopic = "all";
      state.activeRegion = "all";
      state.activeSource = "all";
      state.searchQuery = "";
      el.searchInput.value = "";
      el.setSwitchRow.querySelectorAll("[data-set]").forEach(b => b.classList.toggle("active", b === btn));
      loadAllFeeds();
    });
  });

  // ============================================================
  // Article rendering
  // ============================================================
  function getFilteredArticles() {
    let list = state.articles;
    if (state.activeTopic !== "all") list = list.filter(a => a.topics.includes(state.activeTopic));
    if (state.activeRegion !== "all") list = list.filter(a => a.region === state.activeRegion);
    if (state.activeSource !== "all") list = list.filter(a => a.outletId === state.activeSource);
    if (state.searchQuery) {
      list = list.filter(a =>
        a.title.toLowerCase().includes(state.searchQuery) ||
        a.description.toLowerCase().includes(state.searchQuery)
      );
    }

    list = list.slice();
    if (state.sortMode === "newest") {
      list.sort((a, b) => (b.pubDate ? b.pubDate.getTime() : 0) - (a.pubDate ? a.pubDate.getTime() : 0));
    } else {
      list.sort((a, b) => a.outletName.localeCompare(b.outletName));
    }
    return list;
  }

  function timeAgo(date) {
    if (!date) return "";
    const diffMs = Date.now() - date.getTime();
    const hrs = Math.floor(diffMs / 3600000);
    if (hrs < 1) { const m = Math.max(1, Math.floor(diffMs / 60000)); return m + "m ago"; }
    if (hrs < 24) return hrs + "h ago";
    return Math.floor(hrs / 24) + "d ago";
  }

  function renderArticles() {
    const list = getFilteredArticles();
    el.resultCount.textContent = list.length + " headline" + (list.length === 1 ? "" : "s");

    if (!list.length) {
      const message = state.articles.length === 0
        ? "No headlines loaded yet. Check the notice above, or try \u201crefresh all\u201d."
        : "No headlines match these filters right now. Try a different topic, region, or source.";
      el.articleGrid.innerHTML = `<div class="empty-state">${message}</div>`;
      return;
    }

    el.articleGrid.innerHTML = list.map(a => `
      <div class="article-card">
        <div class="article-source-row">
          <span class="article-source">${escapeHtml(a.outletName)}</span>
          <span class="article-region">${escapeHtml(a.region)}</span>
        </div>
        <div class="article-title"><a href="${escapeAttr(a.link)}" target="_blank" rel="noopener">${escapeHtml(a.title)}</a></div>
        ${a.description ? `<div class="article-desc">${escapeHtml(a.description)}</div>` : ""}
        <div class="article-footer">
          <span class="article-time">${escapeHtml(timeAgo(a.pubDate))}</span>
          <div class="article-topics">${a.topics.map(t => `<span class="topic-tag">${escapeHtml(t)}</span>`).join("")}</div>
        </div>
      </div>`).join("");
  }

  // ============================================================
  // Video rendering — thumbnail first, real YouTube iframe embed only
  // injected after a click. This keeps the page from silently loading
  // 6+ embedded players (and their network/tracking requests) before
  // anyone has asked to watch anything.
  // ============================================================
  function renderVideos() {
    const outlets = outletsForActiveSet();
    const verifiedCount = outlets.filter(o => o.youtubeChannelId).length;

    if (verifiedCount === 0) {
      el.videoNotice.innerHTML = `<b>No video sources verified yet for this outlet set.</b> Embedding the wrong channel under a trusted outlet's name is worse than showing nothing, so this app only embeds a channel after independently confirming its real YouTube channel ID — see the README for how to add one.`;
      el.videoNotice.classList.add("show");
      el.videoGrid.innerHTML = "";
      return;
    }

    if (!state.videos.length) {
      el.videoNotice.innerHTML = `<b>${verifiedCount} outlet${verifiedCount === 1 ? "" : "s"} with verified video sources</b> in this set, but no videos loaded yet — try "refresh all," or the YouTube feed proxy may be temporarily unavailable.`;
      el.videoNotice.classList.add("show");
      el.videoGrid.innerHTML = "";
      return;
    }

    el.videoNotice.classList.remove("show");
    el.videoGrid.innerHTML = state.videos.map(v => `
      <div class="video-card" data-video-id="${escapeAttr(v.videoId)}">
        <div class="video-thumb-wrap" data-thumb>
          <img src="${escapeAttr(v.thumbUrl)}" alt="" loading="lazy">
          <div class="video-play-overlay">
            <div class="video-play-button"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
          </div>
        </div>
        <div class="video-body">
          <span class="video-source">${escapeHtml(v.outletName)}</span>
          <div class="video-title">${escapeHtml(v.title)}</div>
          <span class="video-time">${escapeHtml(timeAgo(v.publishedAt))}</span>
        </div>
      </div>`).join("");

    el.videoGrid.querySelectorAll("[data-thumb]").forEach(thumbEl => {
      thumbEl.addEventListener("click", () => {
        const card = thumbEl.closest(".video-card");
        const videoId = card.getAttribute("data-video-id");
        thumbEl.innerHTML = `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }, { once: true });
    });
  }

  // ============================================================
  // Init
  // ============================================================
  loadAllFeeds();
})();
