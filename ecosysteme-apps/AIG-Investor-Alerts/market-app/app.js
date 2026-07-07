// ============================================================
// Correlate — cross-market research terminal
// Real data sources:
//   - Crypto: CoinGecko public API (no key, CORS-open, free)
//   - Stocks/indices: Alpha Vantage or Finnhub (requires user's own free key)
//   - News: Google News RSS via a public CORS proxy (best-effort)
// Everything here is informational; no trading, no advice.
// ============================================================

(function () {
  "use strict";

  // This whole file does nothing unless someone is actually logged in.
  // The login/registration screen (wired in index.html) is what shows
  // instead when there's no current user — this guard just makes sure
  // app.js itself never touches the DOM or network in that case.
  if (!window.AIGAuth || !window.AIGAuth.getCurrentUser()) return;

  // ============================================================
  // file:// origin guard — CoinGecko (and most real APIs) reject
  // requests from origin "null", which is what every browser uses
  // for a double-clicked local HTML file. Detect this up front and
  // tell the person exactly how to fix it, instead of letting every
  // fetch fail silently with a cryptic CORS error.
  // ============================================================
  let stickyFileProtocolNotice = false;

  function showNotice(html) {
    if (stickyFileProtocolNotice) return; // the file:// instructions take priority over everything else
    el.notice.innerHTML = html;
    el.notice.classList.add("show");
  }

  // ---------------- Constants ----------------
  const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
  const RSS_PROXY = "https://api.allorigins.win/raw?url="; // public CORS proxy for RSS
  const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US:en&q=";

  const DEFAULT_WATCHLIST = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", cls: "crypto" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", cls: "crypto" },
    { id: "solana", symbol: "SOL", name: "Solana", cls: "crypto" },
    { id: "AAPL", symbol: "AAPL", name: "Apple Inc.", cls: "stock" },
    { id: "NVDA", symbol: "NVDA", name: "NVIDIA Corp.", cls: "stock" },
    { id: "SPY", symbol: "SPY", name: "S&P 500 ETF", cls: "stock" },
    { id: "GC=F", symbol: "GOLD", name: "Gold futures", cls: "commodity" }
  ];

  const CLASS_LABEL = { crypto: "CRYPTO", stock: "STOCK", commodity: "COMMODITY" };

  // ---------------- State ----------------
  const state = {
    watchlist: loadWatchlist(),
    quotes: {},      // id -> { price, changePct, history: [..30 daily closes..] }
    selected: null,
    stockProvider: localStorage.getItem(window.AIGAuth.scopedKey("correlate_stock_provider")) || "alphavantage",
    stockKey: localStorage.getItem(window.AIGAuth.scopedKey("correlate_stock_key")) || "",
    aiKey: localStorage.getItem(window.AIGAuth.scopedKey("correlate_ai_key")) || "",
    newsCache: {}
  };

  function loadWatchlist() {
    try {
      const raw = localStorage.getItem(window.AIGAuth.scopedKey("correlate_watchlist_v1"));
      if (raw) return JSON.parse(raw);
    } catch (e) { /* fall through */ }
    return DEFAULT_WATCHLIST.slice();
  }
  function saveWatchlist() {
    localStorage.setItem(window.AIGAuth.scopedKey("correlate_watchlist_v1"), JSON.stringify(state.watchlist));
  }

  // ---------------- DOM refs ----------------
  const el = {
    heatstrip: document.getElementById("heatstrip"),
    assetList: document.getElementById("assetList"),
    watchlistMeta: document.getElementById("watchlistMeta"),
    detailTitle: document.getElementById("detailTitle"),
    detailClass: document.getElementById("detailClass"),
    detailBody: document.getElementById("detailBody"),
    topCrypto: document.getElementById("topCrypto"),
    marketNews: document.getElementById("marketNews"),
    notice: document.getElementById("dataNotice"),
    searchInput: document.getElementById("searchInput"),
    searchBtn: document.getElementById("searchBtn"),
    ledCrypto: document.getElementById("ledCrypto"),
    ledStocks: document.getElementById("ledStocks"),
    ledNews: document.getElementById("ledNews"),
    cryptoStatusText: document.getElementById("cryptoStatusText"),
    stockStatusText: document.getElementById("stockStatusText"),
    newsStatusText: document.getElementById("newsStatusText"),
    setKeyBtn: document.getElementById("setKeyBtn"),
    keyModal: document.getElementById("keyModal"),
    providerSelect: document.getElementById("providerSelect"),
    apiKeyInput: document.getElementById("apiKeyInput"),
    saveKeyBtn: document.getElementById("saveKeyBtn"),
    clearKeyBtn: document.getElementById("clearKeyBtn"),
    closeKeyBtn: document.getElementById("closeKeyBtn"),
    riskModal: document.getElementById("riskModal"),
    riskDetailsBtn: document.getElementById("riskDetailsBtn"),
    acknowledgeRiskBtn: document.getElementById("acknowledgeRiskBtn"),
    setAiKeyBtn: document.getElementById("setAiKeyBtn"),
    aiKeyModal: document.getElementById("aiKeyModal"),
    aiKeyInput: document.getElementById("aiKeyInput"),
    saveAiKeyBtn: document.getElementById("saveAiKeyBtn"),
    clearAiKeyBtn: document.getElementById("clearAiKeyBtn"),
    closeAiKeyBtn: document.getElementById("closeAiKeyBtn"),
    ledAi: document.getElementById("ledAi"),
    aiStatusText: document.getElementById("aiStatusText"),
    aiSummaryWrap: document.getElementById("aiSummaryWrap"),
    aiSummaryBody: document.getElementById("aiSummaryBody"),
    generateSummaryBtn: document.getElementById("generateSummaryBtn")
  };

  // file:// origin guard — CoinGecko (and most real APIs) reject requests
  // from origin "null", which is what every browser uses for a
  // double-clicked local HTML file. Detect this up front and tell the
  // person exactly how to fix it, instead of letting every fetch fail
  // silently with a cryptic CORS error. This must run after `el` exists.
  if (window.location.protocol === "file:") {
    showNotice(`
      <b>This page needs to run from a local web server, not opened directly as a file.</b>
      Browsers block live API requests from <code class="mono">file://</code> pages for security reasons —
      this affects every market data source this app uses, not just one of them.
      <br><br>
      Fix: open a terminal in this folder and run one of these, then open the printed address:<br>
      <code class="mono">python3 -m http.server 8000</code> &nbsp;or&nbsp; <code class="mono">npx serve</code><br>
      Then visit <code class="mono">http://localhost:8000</code> instead of double-clicking the file.
    `);
    stickyFileProtocolNotice = true; // lock it in AFTER the message is actually shown
  }

  function showNotice(html) {
    if (stickyFileProtocolNotice) return; // the file:// instructions take priority over everything else
    el.notice.innerHTML = html;
    el.notice.classList.add("show");
  }
  function setLed(ledEl, statusEl, state_, text) {
    ledEl.classList.remove("live", "error");
    if (state_ === "live") ledEl.classList.add("live");
    if (state_ === "error") ledEl.classList.add("error");
    statusEl.textContent = text;
  }

  // ============================================================
  // Crypto data — CoinGecko, real, no key required
  // ============================================================
  async function fetchCryptoMarkets(ids) {
    if (!ids.length) return {};
    const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${ids.join(",")}&price_change_percentage=24h`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("CoinGecko markets request failed: " + res.status);
    const data = await res.json();
    const out = {};
    data.forEach(c => {
      out[c.id] = {
        price: c.current_price,
        changePct: c.price_change_percentage_24h,
        rawName: c.name
      };
    });
    return out;
  }

  async function fetchCryptoHistory(id, days) {
    const url = `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("CoinGecko history failed for " + id);
    const data = await res.json();
    return (data.prices || []).map(p => p[1]); // closing prices only
  }

  // ============================================================
  // Stock data — Alpha Vantage / Finnhub, requires user key
  // ============================================================
  async function fetchStockQuote(symbol) {
    if (!state.stockKey) throw new Error("NO_KEY");
    if (state.stockProvider === "finnhub") {
      const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${state.stockKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Finnhub quote failed: " + res.status);
      const data = await res.json();
      if (data.c === undefined || data.c === 0) throw new Error("Finnhub returned no data for " + symbol);
      return { price: data.c, changePct: data.dp };
    } else {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${state.stockKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Alpha Vantage quote failed: " + res.status);
      const data = await res.json();
      const q = data["Global Quote"];
      if (!q || !q["05. price"]) throw new Error("Alpha Vantage returned no data for " + symbol + " (rate limit or invalid symbol)");
      return { price: parseFloat(q["05. price"]), changePct: parseFloat((q["10. change percent"] || "0").replace("%", "")) };
    }
  }

  async function fetchStockHistory(symbol) {
    if (!state.stockKey) throw new Error("NO_KEY");
    if (state.stockProvider === "finnhub") {
      const now = Math.floor(Date.now() / 1000);
      const from = now - 60 * 60 * 24 * 35;
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${from}&to=${now}&token=${state.stockKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.s !== "ok") throw new Error("Finnhub candle data unavailable for " + symbol);
      return data.c; // closes
    } else {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&apikey=${state.stockKey}`;
      const res = await fetch(url);
      const data = await res.json();
      const series = data["Time Series (Daily)"];
      if (!series) throw new Error("Alpha Vantage daily series unavailable for " + symbol + " (rate limit likely)");
      const closes = Object.keys(series).sort().slice(-30).map(d => parseFloat(series[d]["4. close"]));
      return closes;
    }
  }

  // Real fundamentals only — every field here is a number we actually got
  // back from the provider. If a field is missing, it stays null and the
  // UI shows "no data" rather than guessing or substituting a placeholder.
  async function fetchFundamentals(symbol) {
    if (!state.stockKey) throw new Error("NO_KEY");
    if (state.stockProvider === "finnhub") {
      const url = `https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${state.stockKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Finnhub fundamentals failed: " + res.status);
      const data = await res.json();
      const m = data.metric || {};
      return {
        peRatio: numOrNull(m.peExclExtraTTM),
        revenueGrowth: numOrNull(m.revenueGrowthTTMYoy),
        netMargin: numOrNull(m.netProfitMarginTTM),
        roe: numOrNull(m.roeTTM)
      };
    } else {
      const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${state.stockKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Alpha Vantage overview failed: " + res.status);
      const data = await res.json();
      if (!data || !data.Symbol) throw new Error("Alpha Vantage returned no overview for " + symbol);
      return {
        peRatio: numOrNull(data.PERatio),
        revenueGrowth: numOrNull(data.QuarterlyRevenueGrowthYOY) !== null ? numOrNull(data.QuarterlyRevenueGrowthYOY) * 100 : null,
        netMargin: numOrNull(data.ProfitMargin) !== null ? numOrNull(data.ProfitMargin) * 100 : null,
        roe: numOrNull(data.ReturnOnEquityTTM) !== null ? numOrNull(data.ReturnOnEquityTTM) * 100 : null
      };
    }
  }
  function numOrNull(v) {
    if (v === undefined || v === null || v === "None" || v === "-") return null;
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  }

  // ============================================================
  // AI summary — optional, user's own Anthropic key. We send ONLY the
  // data already rendered on screen (price, change, correlation list,
  // grade if available) and ask for a plain-language read of it. The
  // model is explicitly instructed not to give advice or predictions,
  // and the UI never presents its output as anything other than a
  // summary of the numbers already shown.
  // ============================================================
  async function generateAiSummary(asset, quote, corrRows, gradeRow) {
    if (!state.aiKey) throw new Error("NO_AI_KEY");

    const corrText = corrRows.length
      ? corrRows.slice(0, 5).map(({ a, r }) => `${a.symbol}: ${r.toFixed(2)}`).join(", ")
      : "no correlated assets with enough overlapping history yet";

    const gradeText = gradeRow
      ? `P/E ${gradeRow.fundamentals.peRatio ?? "n/a"}, revenue growth ${gradeRow.fundamentals.revenueGrowth ?? "n/a"}%, net margin ${gradeRow.fundamentals.netMargin ?? "n/a"}% (value grade ${gradeLetter(gradeRow.valueGrade)}, growth grade ${gradeLetter(gradeRow.growthGrade)}, profitability grade ${gradeLetter(gradeRow.profitGrade)}, all relative to the user's own watchlist)`
      : "no fundamentals data available";

    const prompt = `You are summarizing already-computed market data for a professional investor. Do not add information you weren't given, do not make predictions, and do not recommend buying, selling, or holding anything. Just describe what the numbers below show, in 3-4 plain sentences.

Asset: ${asset.symbol} (${asset.name})
Current price: $${quote.price}
24h change: ${quote.changePct !== undefined ? quote.changePct.toFixed(2) + "%" : "unavailable"}
30-day correlation with other watchlist assets: ${corrText}
Fundamentals: ${gradeText}

End your summary with exactly this sentence, unchanged: "This is a description of the data above, not investment advice."`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": state.aiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error("Anthropic API error " + res.status + (errBody ? ": " + errBody.slice(0, 200) : ""));
    }
    const data = await res.json();
    const textBlock = (data.content || []).find(b => b.type === "text");
    if (!textBlock) throw new Error("Anthropic response had no text content");
    return textBlock.text;
  }

  // ============================================================
  // News — Google News RSS via public CORS proxy, best-effort
  // ============================================================
  async function fetchNews(query, limit) {
    limit = limit || 6;
    if (state.newsCache[query]) return state.newsCache[query];
    const rssUrl = GOOGLE_NEWS_RSS + encodeURIComponent(query);
    const res = await fetch(RSS_PROXY + encodeURIComponent(rssUrl));
    if (!res.ok) throw new Error("News proxy failed: " + res.status);
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    const items = Array.from(xml.querySelectorAll("item")).slice(0, limit).map(item => ({
      title: (item.querySelector("title") || {}).textContent || "",
      link: (item.querySelector("link") || {}).textContent || "",
      pubDate: (item.querySelector("pubDate") || {}).textContent || "",
      source: (item.querySelector("source") || {}).textContent || ""
    }));
    state.newsCache[query] = items;
    return items;
  }

  function timeAgo(pubDate) {
    if (!pubDate) return "";
    const d = new Date(pubDate);
    if (isNaN(d.getTime())) return "";
    const diffMs = Date.now() - d.getTime();
    const hrs = Math.floor(diffMs / 3600000);
    if (hrs < 1) return "just now";
    if (hrs < 24) return hrs + "h ago";
    return Math.floor(hrs / 24) + "d ago";
  }

  // ============================================================
  // Correlation engine — real pairwise Pearson correlation
  // on the price history series we fetched for each asset.
  // ============================================================
  function pearsonCorrelation(seriesA, seriesB) {
    const n = Math.min(seriesA.length, seriesB.length);
    if (n < 5) return null; // not enough overlapping data to be meaningful
    const a = seriesA.slice(-n);
    const b = seriesB.slice(-n);
    // Use daily returns, not raw prices — correlating returns is the
    // standard approach and avoids spurious correlation from shared trend/drift.
    const retA = toReturns(a);
    const retB = toReturns(b);
    const m = retA.length;
    if (m < 4) return null;
    const meanA = avg(retA), meanB = avg(retB);
    let cov = 0, varA = 0, varB = 0;
    for (let i = 0; i < m; i++) {
      const da = retA[i] - meanA, db = retB[i] - meanB;
      cov += da * db; varA += da * da; varB += db * db;
    }
    if (varA === 0 || varB === 0) return null;
    return cov / Math.sqrt(varA * varB);
  }
  function toReturns(prices) {
    const r = [];
    for (let i = 1; i < prices.length; i++) {
      if (prices[i - 1] !== 0) r.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    return r;
  }
  function avg(arr) { return arr.reduce((s, v) => s + v, 0) / arr.length; }

  // ============================================================
  // Grading — percentile rank of each stock's fundamentals against
  // the OTHER stocks currently on the watchlist. This is the only
  // honest comparison we can make without a real sector-classification
  // dataset: we are explicit that it's "vs your watchlist," not "vs
  // sector," and every number shown is the real fetched figure.
  // ============================================================
  function computeGrades() {
    const stockAssets = state.watchlist.filter(a => a.cls === "stock" && state.quotes[a.id] && state.quotes[a.id].fundamentals);
    if (stockAssets.length < 2) return null; // percentile ranking needs at least 2 to compare

    function percentileRank(values, value) {
      if (value === null || value === undefined) return null;
      const valid = values.filter(v => v !== null && v !== undefined);
      if (valid.length < 2) return null;
      const below = valid.filter(v => v < value).length;
      return Math.round((below / (valid.length - 1)) * 100);
    }

    const peValues = stockAssets.map(a => state.quotes[a.id].fundamentals.peRatio);
    const growthValues = stockAssets.map(a => state.quotes[a.id].fundamentals.revenueGrowth);
    const marginValues = stockAssets.map(a => state.quotes[a.id].fundamentals.netMargin);

    return stockAssets.map(a => {
      const f = state.quotes[a.id].fundamentals;
      // Lower P/E is conventionally "better value," so invert its percentile.
      const valueGrade = f.peRatio !== null ? (100 - percentileRank(peValues, f.peRatio)) : null;
      const growthGrade = percentileRank(growthValues, f.revenueGrowth);
      const profitGrade = percentileRank(marginValues, f.netMargin);
      return { asset: a, fundamentals: f, valueGrade, growthGrade, profitGrade };
    });
  }

  function gradeLetter(pct) {
    if (pct === null) return "—";
    if (pct >= 80) return "A";
    if (pct >= 60) return "B";
    if (pct >= 40) return "C";
    if (pct >= 20) return "D";
    return "F";
  }
  function gradeColor(pct) {
    if (pct === null) return "var(--text-faint)";
    if (pct >= 60) return "var(--green)";
    if (pct >= 40) return "var(--amber)";
    return "var(--red)";
  }

  // ============================================================
  // Correlation alerts — flag pairs whose |correlation| crosses a
  // threshold. This is exactly the same Pearson math used elsewhere,
  // just surfaced proactively instead of only on click-through.
  // ============================================================
  const CORRELATION_ALERT_THRESHOLD = 0.7;
  function computeCorrelationAlerts() {
    const assets = state.watchlist;
    const alerts = [];
    for (let i = 0; i < assets.length; i++) {
      for (let j = i + 1; j < assets.length; j++) {
        const r = computeCorrelation(assets[i].id, assets[j].id);
        if (r !== null && Math.abs(r) >= CORRELATION_ALERT_THRESHOLD) {
          alerts.push({ a: assets[i], b: assets[j], r });
        }
      }
    }
    return alerts.sort((x, y) => Math.abs(y.r) - Math.abs(x.r));
  }

  function correlationColor(r) {
    if (r === null) return "#1c2129";
    const abs = Math.min(1, Math.abs(r));
    if (r >= 0) {
      // positive correlation -> amber scale
      const l = 20 + abs * 35;
      return `hsl(38, 75%, ${l}%)`;
    } else {
      // negative correlation -> blue scale
      const l = 20 + abs * 35;
      return `hsl(204, 55%, ${l}%)`;
    }
  }

  // ============================================================
  // Rendering
  // ============================================================
  function renderWatchlist() {
    el.watchlistMeta.textContent = state.watchlist.length + " assets";
    el.assetList.innerHTML = state.watchlist.map(a => {
      const q = state.quotes[a.id];
      const priceText = q ? "$" + formatNum(q.price) : "&hellip;";
      const changeText = q && q.changePct !== undefined && q.changePct !== null
        ? (q.changePct >= 0 ? "+" : "") + q.changePct.toFixed(2) + "%"
        : "&mdash;";
      const changeCls = q && q.changePct >= 0 ? "up" : "down";
      const activeCls = state.selected === a.id ? "active" : "";
      return `
        <div class="asset-row ${activeCls}" data-id="${escapeAttr(a.id)}">
          <span class="asset-class-tag tag-${a.cls}">${a.cls[0].toUpperCase()}</span>
          <div>
            <div class="asset-symbol">${escapeHtml(a.symbol)}</div>
            <div class="asset-name">${escapeHtml(a.name)}</div>
          </div>
          <div class="asset-price mono">${priceText}</div>
          <div class="asset-change mono ${changeCls}">${changeText}</div>
          <div></div>
        </div>`;
    }).join("");

    el.assetList.querySelectorAll(".asset-row").forEach(row => {
      row.addEventListener("click", () => selectAsset(row.getAttribute("data-id")));
    });
  }

  function formatNum(n) {
    if (n === undefined || n === null) return "&mdash;";
    if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
    if (n >= 1) return n.toFixed(2);
    return n.toPrecision(4);
  }

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }

  function renderHeatstrip() {
    const assets = state.watchlist;
    // We render a 1-row strip: correlation of each asset against the FIRST asset
    // in the watchlist, as a compact "vs benchmark" view. Clicking the strip
    // cell selects that asset so its full pairwise table shows in the detail panel.
    if (!assets.length) { el.heatstrip.innerHTML = ""; return; }
    const benchmark = assets[0];
    el.heatstrip.innerHTML = assets.map(a => {
      const r = computeCorrelation(benchmark.id, a.id);
      const color = correlationColor(r);
      const label = r === null ? "&mdash;" : r.toFixed(2);
      return `
        <div class="heat-cell" style="background:${color};" data-id="${escapeAttr(a.id)}">
          ${escapeHtml(a.symbol)}
          <div class="heat-tip mono">${escapeHtml(a.symbol)} vs ${escapeHtml(benchmark.symbol)}: ${label}</div>
        </div>`;
    }).join("");
    el.heatstrip.querySelectorAll(".heat-cell").forEach(cell => {
      cell.addEventListener("click", () => selectAsset(cell.getAttribute("data-id")));
    });
  }

  function computeCorrelation(idA, idB) {
    const qa = state.quotes[idA], qb = state.quotes[idB];
    if (!qa || !qb || !qa.history || !qb.history) return null;
    return pearsonCorrelation(qa.history, qb.history);
  }

  async function selectAsset(id) {
    state.selected = id;
    renderWatchlist();
    const asset = state.watchlist.find(a => a.id === id);
    if (!asset) return;
    el.detailTitle.textContent = asset.symbol + " — " + asset.name;
    el.detailClass.textContent = CLASS_LABEL[asset.cls];
    el.detailBody.innerHTML = `<div class="loading-row">loading detail&hellip;</div>`;

    const q = state.quotes[id];
    if (!q) {
      el.detailBody.innerHTML = `<div class="empty-state">No data available for this asset yet.</div>`;
      return;
    }

    const corrRows = state.watchlist
      .filter(a => a.id !== id)
      .map(a => ({ a, r: computeCorrelation(id, a.id) }))
      .filter(x => x.r !== null)
      .sort((x, y) => Math.abs(y.r) - Math.abs(x.r));

    const corrHtml = corrRows.length
      ? corrRows.map(({ a, r }) => {
          const pct = Math.abs(r) * 100;
          const color = correlationColor(r);
          return `
            <div class="corr-row">
              <span class="corr-symbol mono">${escapeHtml(a.symbol)}</span>
              <div class="corr-bar-track"><div class="corr-bar-fill" style="width:${pct}%; background:${color};"></div></div>
              <span class="corr-value mono">${r.toFixed(2)}</span>
            </div>`;
        }).join("")
      : `<div class="empty-state">Not enough overlapping history yet to compute correlations.</div>`;

    const chartSvg = buildSparkline(q.history || []);

    el.detailBody.innerHTML = `
      <div class="detail-header">
        <div class="detail-price mono">$${formatNum(q.price)}</div>
        <div class="asset-change mono ${q.changePct >= 0 ? "up" : "down"}">${q.changePct !== undefined ? (q.changePct >= 0 ? "+" : "") + q.changePct.toFixed(2) + "%" : ""}</div>
      </div>
      <div class="detail-meta">24h change &middot; ${q.history ? q.history.length : 0} days of history loaded</div>
      <div class="chart-wrap">${chartSvg}</div>
      <div class="panel-title" style="margin:18px 0 8px;">Correlated movers (30d, return-based)</div>
      <div class="corr-list">${corrHtml}</div>
      <div class="panel-title" style="margin:18px 0 8px;">Related headlines</div>
      <div id="assetNewsBlock" class="loading-row">loading headlines&hellip;</div>
    `;

    loadAssetNews(asset);

    // Stash the data the AI summary needs, scoped to this selection, and
    // reset the panel so a stale summary from a previous asset can't linger.
    state.currentDetailContext = { asset, quote: q, corrRows, gradeRow: (computeGrades() || []).find(g => g.asset.id === id) || null };
    el.aiSummaryWrap.style.display = state.aiKey ? "block" : "none";
    el.aiSummaryBody.textContent = "";
  }

  async function loadAssetNews(asset) {
    const block = document.getElementById("assetNewsBlock");
    if (!block) return;
    try {
      const items = await fetchNews(asset.name);
      if (!items.length) { block.innerHTML = `<div class="empty-state">No recent headlines found.</div>`; return; }
      block.innerHTML = items.map(it => `
        <div class="news-item">
          <div class="news-title"><a href="${escapeAttr(it.link)}" target="_blank" rel="noopener">${escapeHtml(stripSource(it.title))}</a></div>
          <div class="news-meta">${escapeHtml(it.source)} &middot; ${timeAgo(it.pubDate)}</div>
        </div>`).join("");
    } catch (e) {
      block.innerHTML = `<div class="empty-state">Headlines unavailable right now (news proxy unreachable). Try again shortly.</div>`;
    }
  }
  function stripSource(title) {
    // Google News titles often end with " - Source Name"; trim for readability.
    const idx = title.lastIndexOf(" - ");
    return idx > title.length - 40 ? title.slice(0, idx) : title;
  }

  function buildSparkline(history) {
    if (!history || history.length < 2) {
      return `<svg viewBox="0 0 300 100" preserveAspectRatio="none"></svg>`;
    }
    const w = 300, h = 100, pad = 6;
    const min = Math.min(...history), max = Math.max(...history);
    const range = max - min || 1;
    const pts = history.map((v, i) => {
      const x = pad + (i / (history.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const last = history[history.length - 1], first = history[0];
    const color = last >= first ? "#5fb88a" : "#d3685f";
    return `
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="1.6" />
      </svg>`;
  }

  // ============================================================
  // Top mover / market news panels
  // ============================================================
  async function renderTopCrypto() {
    try {
      const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=5&page=1&price_change_percentage=24h`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("top movers failed");
      const data = await res.json();
      el.topCrypto.innerHTML = data.slice(0, 5).map(c => `
        <div class="asset-row" style="grid-template-columns: 1fr auto;">
          <div>
            <div class="asset-symbol">${c.symbol.toUpperCase()}</div>
            <div class="asset-name">${escapeHtml(c.name)}</div>
          </div>
          <div class="asset-change mono ${c.price_change_percentage_24h >= 0 ? "up" : "down"}">
            ${c.price_change_percentage_24h >= 0 ? "+" : ""}${c.price_change_percentage_24h.toFixed(1)}%
          </div>
        </div>`).join("");
    } catch (e) {
      el.topCrypto.innerHTML = `<div class="empty-state">Top movers unavailable right now.</div>`;
    }
  }

  async function renderMarketNews() {
    try {
      const items = await fetchNews("stock market OR crypto market", 6);
      setLed(el.ledNews, el.newsStatusText, "live", "live");
      if (!items.length) { el.marketNews.innerHTML = `<div class="empty-state">No headlines found.</div>`; return; }
      el.marketNews.innerHTML = items.map(it => `
        <div class="news-item">
          <div class="news-title"><a href="${escapeAttr(it.link)}" target="_blank" rel="noopener">${escapeHtml(stripSource(it.title))}</a></div>
          <div class="news-meta">${escapeHtml(it.source)} &middot; ${timeAgo(it.pubDate)}</div>
        </div>`).join("");
    } catch (e) {
      setLed(el.ledNews, el.newsStatusText, "error", "unavailable");
      el.marketNews.innerHTML = `<div class="empty-state">News proxy unreachable right now. This relies on a public CORS proxy that can be rate-limited — try reloading in a minute.</div>`;
    }
  }

  function renderGrades() {
    const block = document.getElementById("gradesBlock");
    if (!block) return;
    const grades = computeGrades();
    if (!state.stockKey) {
      block.innerHTML = `<div class="empty-state">Grading needs fundamentals data, which needs a stock API key. Set one above.</div>`;
      return;
    }
    if (!grades) {
      block.innerHTML = `<div class="empty-state">Add at least 2 stocks with available fundamentals to see relative grades.</div>`;
      return;
    }
    block.innerHTML = `
      <div style="font-size:11px; color:var(--text-faint); margin-bottom:10px;">
        Percentile rank vs the other stocks on <i>your</i> watchlist — not a sector benchmark.
        Value grade favors lower P/E; growth and profitability favor higher revenue growth and net margin.
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:12px;">
        <tr style="color:var(--text-faint); text-align:left;">
          <th style="padding:4px 6px 8px 0;">Symbol</th>
          <th style="padding:4px 6px 8px;">P/E</th>
          <th style="padding:4px 6px 8px;">Rev growth</th>
          <th style="padding:4px 6px 8px;">Net margin</th>
          <th style="padding:4px 6px 8px;">Value</th>
          <th style="padding:4px 6px 8px;">Growth</th>
          <th style="padding:4px 6px 8px;">Profit</th>
        </tr>
        ${grades.map(g => `
          <tr style="border-top:1px solid var(--line);">
            <td class="mono" style="padding:7px 6px 7px 0; font-weight:600;">${escapeHtml(g.asset.symbol)}</td>
            <td class="mono" style="padding:7px 6px;">${g.fundamentals.peRatio !== null ? g.fundamentals.peRatio.toFixed(1) : "&mdash;"}</td>
            <td class="mono" style="padding:7px 6px;">${g.fundamentals.revenueGrowth !== null ? g.fundamentals.revenueGrowth.toFixed(1) + "%" : "&mdash;"}</td>
            <td class="mono" style="padding:7px 6px;">${g.fundamentals.netMargin !== null ? g.fundamentals.netMargin.toFixed(1) + "%" : "&mdash;"}</td>
            <td style="padding:7px 6px; color:${gradeColor(g.valueGrade)}; font-weight:600;">${gradeLetter(g.valueGrade)}</td>
            <td style="padding:7px 6px; color:${gradeColor(g.growthGrade)}; font-weight:600;">${gradeLetter(g.growthGrade)}</td>
            <td style="padding:7px 6px; color:${gradeColor(g.profitGrade)}; font-weight:600;">${gradeLetter(g.profitGrade)}</td>
          </tr>
        `).join("")}
      </table>
    `;
  }

  function renderCorrelationAlerts() {
    const block = document.getElementById("alertsBlock");
    if (!block) return;
    const alerts = computeCorrelationAlerts();
    if (!alerts.length) {
      block.innerHTML = `<div class="empty-state">No pairs above |r| &ge; ${CORRELATION_ALERT_THRESHOLD} right now. That's normal — strong correlations come and go.</div>`;
      return;
    }
    block.innerHTML = alerts.map(({ a, b, r }) => {
      const color = correlationColor(r);
      const direction = r > 0 ? "move together" : "move opposite";
      return `
        <div class="sub-card" style="background:var(--panel-raised); border-radius:4px; padding:10px 12px; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="font-size:12.5px;">
            <span class="mono" style="font-weight:600;">${escapeHtml(a.symbol)}</span> &harr;
            <span class="mono" style="font-weight:600;">${escapeHtml(b.symbol)}</span>
            <span style="color:var(--text-dim);"> &mdash; tend to ${direction}</span>
          </div>
          <div class="mono" style="font-weight:600; color:${color};">${r.toFixed(2)}</div>
        </div>`;
    }).join("");
  }

  // ============================================================
  // Bootstrapping — load all quotes + history for the watchlist
  // ============================================================
  async function loadAllData() {
    const cryptoAssets = state.watchlist.filter(a => a.cls === "crypto");
    const stockAssets = state.watchlist.filter(a => a.cls !== "crypto");

    // --- Crypto (always attempted; real, keyless) ---
    if (cryptoAssets.length) {
      try {
        const markets = await fetchCryptoMarkets(cryptoAssets.map(a => a.id));
        cryptoAssets.forEach(a => {
          const m = markets[a.id];
          if (m) state.quotes[a.id] = state.quotes[a.id] || {};
          if (m) Object.assign(state.quotes[a.id], { price: m.price, changePct: m.changePct });
        });
        setLed(el.ledCrypto, el.cryptoStatusText, "live", "live");
      } catch (e) {
        setLed(el.ledCrypto, el.cryptoStatusText, "error", "error");
        showNotice(`<b>Crypto data error:</b> couldn't reach CoinGecko (${escapeHtml(e.message)}). This is usually temporary — try reloading.`);
      }

      for (const a of cryptoAssets) {
        try {
          const hist = await fetchCryptoHistory(a.id, 30);
          state.quotes[a.id] = state.quotes[a.id] || {};
          state.quotes[a.id].history = hist;
        } catch (e) { /* history is best-effort; quote still shows without it */ }
      }
    } else {
      setLed(el.ledCrypto, el.cryptoStatusText, "live", "no assets");
    }

    renderWatchlist();
    renderHeatstrip();

    // --- Stocks (only if a key is set) ---
    if (!state.stockKey) {
      setLed(el.ledStocks, el.stockStatusText, "error", "no key set");
      showNotice(`<b>Stock data needs an API key.</b> Crypto correlation works immediately, but stocks/indices/commodities (AAPL, NVDA, SPY, gold futures) stay blank until you add a free key via "set stock API key" above.`);
    } else {
      setLed(el.ledStocks, el.stockStatusText, "live", "connecting");
      let anySuccess = false, anyError = null;
      for (const a of stockAssets) {
        try {
          const quote = await fetchStockQuote(a.id);
          state.quotes[a.id] = state.quotes[a.id] || {};
          Object.assign(state.quotes[a.id], quote);
          anySuccess = true;
          renderWatchlist();
        } catch (e) { anyError = e; }
        try {
          const hist = await fetchStockHistory(a.id);
          state.quotes[a.id] = state.quotes[a.id] || {};
          state.quotes[a.id].history = hist;
        } catch (e) { /* best-effort */ }
        try {
          const fund = await fetchFundamentals(a.id);
          state.quotes[a.id] = state.quotes[a.id] || {};
          state.quotes[a.id].fundamentals = fund;
        } catch (e) { /* best-effort — grading panel just shows "no data" for this one */ }
        // Free tiers are rate-limited per minute; pace requests politely.
        await sleep(800);
      }
      if (anySuccess) {
        setLed(el.ledStocks, el.stockStatusText, "live", "live");
      } else {
        setLed(el.ledStocks, el.stockStatusText, "error", "error");
        showNotice(`<b>Stock data error:</b> ${escapeHtml(anyError ? anyError.message : "unknown error")}. Free-tier keys are rate-limited (Alpha Vantage: ~25/day, Finnhub: ~60/min) — this is the most common cause.`);
      }
    }

    renderWatchlist();
    renderHeatstrip();
    renderGrades();
    renderCorrelationAlerts();
  }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ============================================================
  // Search / add ticker
  // ============================================================
  async function addAsset(query) {
    query = query.trim();
    if (!query) return;

    // Guard against duplicates — both by raw id and by symbol, since a user
    // might type "BTC" when "bitcoin" is already on the list.
    const queryLower = query.toLowerCase();
    const alreadyPresent = state.watchlist.some(a =>
      a.id.toLowerCase() === queryLower || a.symbol.toLowerCase() === queryLower
    );
    if (alreadyPresent) {
      showNotice(`<b>${escapeHtml(query)}</b> is already on your watchlist.`);
      return;
    }

    // Heuristic: lowercase alpha-only strings longer than 4 chars are
    // probably a CoinGecko id (e.g. "bitcoin"); short uppercase-ish
    // strings are probably a stock ticker. Either way, we verify by
    // attempting a real fetch rather than guessing silently.
    const looksLikeCoinId = /^[a-z0-9-]+$/.test(query) && query.length > 4 && query === query.toLowerCase();
    if (looksLikeCoinId) {
      try {
        const markets = await fetchCryptoMarkets([query]);
        if (markets[query]) {
          state.watchlist.push({ id: query, symbol: query.slice(0, 6).toUpperCase(), name: markets[query].rawName || query, cls: "crypto" });
          saveWatchlist();
          await loadAllData();
          return;
        }
      } catch (e) { /* fall through to treat as stock */ }
    }
    const symbol = query.toUpperCase();
    state.watchlist.push({ id: symbol, symbol: symbol, name: symbol, cls: "stock" });
    saveWatchlist();
    await loadAllData();
  }

  // ============================================================
  // Key modal wiring
  // ============================================================
  function openKeyModal() {
    el.providerSelect.value = state.stockProvider;
    el.apiKeyInput.value = state.stockKey;
    el.keyModal.classList.add("open");
  }
  function closeKeyModal() { el.keyModal.classList.remove("open"); }

  el.setKeyBtn.addEventListener("click", openKeyModal);
  el.closeKeyBtn.addEventListener("click", closeKeyModal);
  el.keyModal.addEventListener("click", e => { if (e.target === el.keyModal) closeKeyModal(); });

  el.saveKeyBtn.addEventListener("click", () => {
    state.stockProvider = el.providerSelect.value;
    state.stockKey = el.apiKeyInput.value.trim();
    localStorage.setItem(window.AIGAuth.scopedKey("correlate_stock_provider"), state.stockProvider);
    localStorage.setItem(window.AIGAuth.scopedKey("correlate_stock_key"), state.stockKey);
    closeKeyModal();
    el.notice.classList.remove("show");
    loadAllData();
  });
  el.clearKeyBtn.addEventListener("click", () => {
    state.stockKey = "";
    localStorage.removeItem(window.AIGAuth.scopedKey("correlate_stock_key"));
    el.apiKeyInput.value = "";
  });

  el.searchBtn.addEventListener("click", () => { addAsset(el.searchInput.value); el.searchInput.value = ""; });
  el.searchInput.addEventListener("keydown", e => { if (e.key === "Enter") { addAsset(el.searchInput.value); el.searchInput.value = ""; } });

  // ---------------- Risk disclosure (read-only viewer) ----------------
  // Acknowledgment itself now happens once, at registration (see auth.js
  // and the registration screen in index.html) — this link just lets a
  // logged-in user re-read the same disclosure text at any time.
  function openRiskModal() { el.riskModal.classList.add("open"); }
  function closeRiskModal() { el.riskModal.classList.remove("open"); }
  el.riskDetailsBtn.addEventListener("click", openRiskModal);
  el.acknowledgeRiskBtn.addEventListener("click", closeRiskModal);

  // ---------------- AI key modal ----------------
  function openAiKeyModal() { el.aiKeyInput.value = state.aiKey; el.aiKeyModal.classList.add("open"); }
  function closeAiKeyModal() { el.aiKeyModal.classList.remove("open"); }
  el.setAiKeyBtn.addEventListener("click", openAiKeyModal);
  el.closeAiKeyBtn.addEventListener("click", closeAiKeyModal);
  el.aiKeyModal.addEventListener("click", e => { if (e.target === el.aiKeyModal) closeAiKeyModal(); });

  function updateAiStatus() {
    if (state.aiKey) setLed(el.ledAi, el.aiStatusText, "live", "ready");
    else setLed(el.ledAi, el.aiStatusText, "error", "no key");
  }

  el.saveAiKeyBtn.addEventListener("click", () => {
    state.aiKey = el.aiKeyInput.value.trim();
    localStorage.setItem(window.AIGAuth.scopedKey("correlate_ai_key"), state.aiKey);
    updateAiStatus();
    closeAiKeyModal();
    if (state.selected) el.aiSummaryWrap.style.display = state.aiKey ? "block" : "none";
  });
  el.clearAiKeyBtn.addEventListener("click", () => {
    state.aiKey = "";
    localStorage.removeItem(window.AIGAuth.scopedKey("correlate_ai_key"));
    el.aiKeyInput.value = "";
    updateAiStatus();
    el.aiSummaryWrap.style.display = "none";
  });

  el.generateSummaryBtn.addEventListener("click", async () => {
    const ctx = state.currentDetailContext;
    if (!ctx) return;
    el.generateSummaryBtn.disabled = true;
    el.generateSummaryBtn.textContent = "Generating…";
    el.aiSummaryBody.textContent = "";
    try {
      const summary = await generateAiSummary(ctx.asset, ctx.quote, ctx.corrRows, ctx.gradeRow);
      el.aiSummaryBody.textContent = summary;
    } catch (e) {
      el.aiSummaryBody.innerHTML = `<span style="color:var(--red);">Couldn't generate a summary: ${escapeHtml(e.message)}</span>`;
    } finally {
      el.generateSummaryBtn.disabled = false;
      el.generateSummaryBtn.textContent = "Generate";
    }
  });

  updateAiStatus();

  // ============================================================
  // Init
  // ============================================================
  renderWatchlist();
  renderTopCrypto();
  renderMarketNews();
  loadAllData();
})();
