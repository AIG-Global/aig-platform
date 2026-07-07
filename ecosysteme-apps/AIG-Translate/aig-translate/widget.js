// ============================================================
// AIG Translate — embeddable widget.
//
// Drop into any page with:
//   <script src="core.js"></script>
//   <script src="widget.js"></script>
//
// Optional config BEFORE including this script:
//   window.AIGTranslateWidgetConfig = {
//     mode: "own-key",       // "own-key" (default) or "backend"
//     backendUrl: "",
//     defaultTargetLanguage: "English",
//     position: "right"      // "right" or "left"
//   };
// ============================================================

(function () {
  "use strict";

  if (!window.AIGTranslateCore) {
    console.error("AIG Translate widget: core.js must be loaded before widget.js");
    return;
  }

  const config = Object.assign({
    mode: "own-key",
    backendUrl: "",
    defaultTargetLanguage: "English",
    position: "right"
  }, window.AIGTranslateWidgetConfig || {});

  const KEY_STORAGE = "aigtranslate_api_key_v1"; // shared with the standalone page on the same origin, same as AIG Ask's pattern
  const languages = window.AIGTranslateCore.SUPPORTED_LANGUAGES;

  const safeStorage = (function () {
    try {
      const t = "__aig_translate_storage_test__";
      localStorage.setItem(t, "1"); localStorage.removeItem(t);
      return localStorage;
    } catch (e) {
      const mem = {};
      return { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = v; }, removeItem: k => { delete mem[k]; } };
    }
  })();

  const state = {
    apiKey: safeStorage.getItem(KEY_STORAGE) || "",
    open: false,
    translating: false
  };

  const style = document.createElement("style");
  style.textContent = `
    #aig-translate-widget-root, #aig-translate-widget-root * { box-sizing: border-box; }
    #aig-translate-widget-root {
      position: fixed; bottom: 24px; ${config.position === "left" ? "left" : "right"}: 24px;
      z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #aig-translate-widget-root .at-bubble-btn {
      width: 56px; height: 56px; border-radius: 50%; background: #e8a33d; border: none; cursor: pointer;
      box-shadow: 0 4px 18px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; font-size: 22px;
    }
    #aig-translate-widget-root .at-bubble-btn:hover { transform: scale(1.06); }
    #aig-translate-widget-root .at-panel {
      position: absolute; bottom: 70px; ${config.position === "left" ? "left" : "right"}: 0;
      width: 340px; max-height: 70vh; background: #0a0d12; border: 1px solid #262c36;
      border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden;
    }
    #aig-translate-widget-root .at-panel.at-open { display: flex; }
    #aig-translate-widget-root .at-header { background: #12161d; border-bottom: 1px solid #262c36; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
    #aig-translate-widget-root .at-brand { display: flex; align-items: center; gap: 8px; color: #e4e7eb; font-weight: 600; font-size: 13px; }
    #aig-translate-widget-root .at-dot { width: 7px; height: 7px; border-radius: 50%; background: #e8a33d; }
    #aig-translate-widget-root .at-close { background: none; border: none; color: #9099a8; cursor: pointer; font-size: 16px; }
    #aig-translate-widget-root .at-body { padding: 14px; overflow-y: auto; flex: 1; }
    #aig-translate-widget-root select { width: 100%; background: #1c2129; border: 1px solid #262c36; color: #e4e7eb; font-size: 12.5px; padding: 8px 10px; border-radius: 6px; margin-bottom: 10px; }
    #aig-translate-widget-root textarea {
      width: 100%; min-height: 90px; background: #1c2129; border: 1px solid #262c36; color: #e4e7eb;
      font-size: 13px; padding: 9px 11px; border-radius: 6px; font-family: inherit; resize: vertical; margin-bottom: 10px;
    }
    #aig-translate-widget-root textarea:focus, #aig-translate-widget-root select:focus { outline: none; border-color: #e8a33d; }
    #aig-translate-widget-root .at-translate-btn {
      width: 100%; background: #e8a33d; color: #1a1206; border: none; font-weight: 700; font-size: 13px;
      padding: 10px; border-radius: 6px; cursor: pointer;
    }
    #aig-translate-widget-root .at-translate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    #aig-translate-widget-root .at-output { margin-top: 12px; background: #12161d; border: 1px solid #262c36; border-radius: 6px; padding: 10px; font-size: 13px; color: #e4e7eb; min-height: 40px; white-space: pre-wrap; }
    #aig-translate-widget-root .at-detected { font-size: 10.5px; color: #5fa8d3; margin-bottom: 6px; }
    #aig-translate-widget-root .at-error { background: rgba(211,104,95,0.12); border: 1px solid #d3685f; color: #f0a39c; font-size: 11.5px; padding: 8px 10px; border-radius: 4px; margin-top: 10px; }
    #aig-translate-widget-root .at-onboard { font-size: 12px; color: #9099a8; line-height: 1.6; }
    #aig-translate-widget-root .at-onboard input { width: 100%; background: #1c2129; border: 1px solid #262c36; color: #e4e7eb; font-size: 12px; padding: 8px 10px; border-radius: 5px; margin: 8px 0; font-family: monospace; }
    #aig-translate-widget-root .at-onboard a { color: #5fa8d3; }
    @media (max-width: 480px) { #aig-translate-widget-root .at-panel { width: calc(100vw - 32px); right: -8px; } }
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "aig-translate-widget-root";
  root.innerHTML = `
    <div class="at-panel" id="atPanel">
      <div class="at-header">
        <div class="at-brand"><span class="at-dot"></span>AIG TRANSLATE</div>
        <button class="at-close" id="atCloseBtn">&times;</button>
      </div>
      <div class="at-body" id="atBody"></div>
    </div>
    <button class="at-bubble-btn" id="atBubbleBtn" aria-label="Open AIG Translate">\u{1F310}</button>
  `;
  document.body.appendChild(root);

  const el = { panel: document.getElementById("atPanel"), body: document.getElementById("atBody"), bubbleBtn: document.getElementById("atBubbleBtn"), closeBtn: document.getElementById("atCloseBtn") };

  function setOpen(open) { state.open = open; el.panel.classList.toggle("at-open", open); if (open) renderBody(); }
  el.bubbleBtn.addEventListener("click", () => setOpen(!state.open));
  el.closeBtn.addEventListener("click", () => setOpen(false));

  function escapeHtmlLocal(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  function renderBody() {
    const needsKey = config.mode === "own-key" && !state.apiKey;
    if (needsKey) renderOnboard(); else renderTranslator();
  }

  function renderOnboard() {
    el.body.innerHTML = `
      <div class="at-onboard">
        Connect an Anthropic API key to start translating. Get one at
        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>.
        <input type="password" id="atKeyInput" placeholder="sk-ant-...">
        <button class="at-translate-btn" id="atKeySaveBtn">Save key</button>
        <div class="at-error" id="atOnboardError" style="display:none;"></div>
      </div>`;
    document.getElementById("atKeySaveBtn").addEventListener("click", () => {
      const val = document.getElementById("atKeyInput").value.trim();
      const errEl = document.getElementById("atOnboardError");
      if (!/^sk-ant-/.test(val)) { errEl.textContent = "That doesn't look like an Anthropic key."; errEl.style.display = "block"; return; }
      state.apiKey = val;
      safeStorage.setItem(KEY_STORAGE, val);
      renderBody();
    });
  }

  function renderTranslator() {
    el.body.innerHTML = `
      <select id="atTargetLang">${languages.map(l => `<option ${l === config.defaultTargetLanguage ? "selected" : ""}>${l}</option>`).join("")}</select>
      <textarea id="atSourceText" placeholder="Type or paste text to translate\u2026"></textarea>
      <button class="at-translate-btn" id="atTranslateBtn">Translate</button>
      <div id="atOutputWrap" style="display:none;">
        <div class="at-output" id="atOutput"></div>
      </div>
      <div class="at-error" id="atError" style="display:none;"></div>`;

    document.getElementById("atTranslateBtn").addEventListener("click", async () => {
      const text = document.getElementById("atSourceText").value.trim();
      const errEl = document.getElementById("atError");
      errEl.style.display = "none";
      if (!text) { errEl.textContent = "Type something to translate first."; errEl.style.display = "block"; return; }
      if (state.translating) return;

      state.translating = true;
      const btn = document.getElementById("atTranslateBtn");
      btn.disabled = true; btn.textContent = "Translating\u2026";
      const targetLanguage = document.getElementById("atTargetLang").value;

      try {
        const result = await window.AIGTranslateCore.translate(text, targetLanguage, {
          mode: config.mode, apiKey: state.apiKey, backendUrl: config.backendUrl
        });
        const wrap = document.getElementById("atOutputWrap");
        wrap.style.display = "block";
        const detectedHtml = (result.detectedLanguage && result.detectedLanguage !== "unknown")
          ? `<div class="at-detected">Detected: ${escapeHtmlLocal(result.detectedLanguage)}</div>` : "";
        document.getElementById("atOutput").innerHTML = detectedHtml + escapeHtmlLocal(result.translation);
      } catch (err) {
        errEl.textContent = "Couldn't translate: " + err.message;
        errEl.style.display = "block";
      } finally {
        state.translating = false;
        btn.disabled = false; btn.textContent = "Translate";
      }
    });
  }
})();
