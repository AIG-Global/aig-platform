// ============================================================
// AIG Translate — standalone app.
// ============================================================

(function () {
  "use strict";

  const KEY_STORAGE = "aigtranslate_api_key_v1";
  const TARGET_LANG_STORAGE = "aigtranslate_target_lang_v1";
  const HISTORY_STORAGE = "aigtranslate_history_v1";
  const MAX_CHARS = 5000;

  const state = {
    apiKey: localStorage.getItem(KEY_STORAGE) || "",
    translating: false,
    history: loadHistory()
  };

  const el = {};
  [
    "onboardShell", "onboardError", "onboardKeyInput", "onboardSaveBtn", "setKeyBtn",
    "translatorShell", "globalNotice", "targetLanguageSelect", "translateBtn",
    "sourceText", "clearBtn", "charCount", "outputArea", "detectedLangPill", "copyOutputBtn",
    "historyArea"
  ].forEach(id => { el[id] = document.getElementById(id); });

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function showNotice(html) { el.globalNotice.innerHTML = html; el.globalNotice.classList.add("show"); }
  function clearNotice() { el.globalNotice.classList.remove("show"); }

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_STORAGE) || "[]"); }
    catch (e) { return []; }
  }
  function saveHistory() { localStorage.setItem(HISTORY_STORAGE, JSON.stringify(state.history.slice(0, 20))); }

  // ============================================================
  // Language dropdown
  // ============================================================
  const languages = window.AIGTranslateCore.SUPPORTED_LANGUAGES;
  el.targetLanguageSelect.innerHTML = languages.map(l => `<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`).join("");
  const savedTarget = localStorage.getItem(TARGET_LANG_STORAGE);
  el.targetLanguageSelect.value = savedTarget && languages.includes(savedTarget) ? savedTarget : "English";
  el.targetLanguageSelect.addEventListener("change", () => localStorage.setItem(TARGET_LANG_STORAGE, el.targetLanguageSelect.value));

  // ============================================================
  // Onboarding
  // ============================================================
  function looksLikeKey(k) { return /^sk-ant-/.test(k.trim()); }
  function applyKeyState() {
    const hasKey = !!state.apiKey;
    el.onboardShell.style.display = hasKey ? "none" : "flex";
    el.translatorShell.style.display = hasKey ? "block" : "none";
  }
  function saveKey(rawKey) {
    state.apiKey = rawKey.trim();
    localStorage.setItem(KEY_STORAGE, state.apiKey);
    applyKeyState();
  }
  el.onboardSaveBtn.addEventListener("click", () => {
    el.onboardError.classList.remove("show");
    const value = el.onboardKeyInput.value;
    if (!value.trim()) { el.onboardError.textContent = "Paste your API key first."; el.onboardError.classList.add("show"); return; }
    if (!looksLikeKey(value)) { el.onboardError.textContent = "That doesn't look like an Anthropic API key — it should start with \u201csk-ant-\u201d."; el.onboardError.classList.add("show"); return; }
    saveKey(value);
    renderHistory();
  });
  el.onboardKeyInput.addEventListener("keydown", e => { if (e.key === "Enter") el.onboardSaveBtn.click(); });
  el.setKeyBtn.addEventListener("click", () => {
    const newKey = prompt("Anthropic API key:", state.apiKey);
    if (newKey === null) return;
    if (!newKey.trim()) { state.apiKey = ""; localStorage.removeItem(KEY_STORAGE); applyKeyState(); return; }
    if (!looksLikeKey(newKey)) { alert("That doesn't look like an Anthropic API key (should start with sk-ant-)."); return; }
    saveKey(newKey);
  });

  // ============================================================
  // Character count
  // ============================================================
  el.sourceText.addEventListener("input", () => {
    const len = el.sourceText.value.length;
    el.charCount.textContent = len;
    el.charCount.style.color = len > MAX_CHARS ? "var(--red)" : "var(--text-faint)";
  });
  el.clearBtn.addEventListener("click", () => {
    el.sourceText.value = "";
    el.charCount.textContent = "0";
    el.sourceText.focus();
  });

  el.sourceText.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); doTranslate(); }
  });

  // ============================================================
  // Translate
  // ============================================================
  el.translateBtn.addEventListener("click", doTranslate);

  async function doTranslate() {
    if (state.translating) return;
    clearNotice();
    const text = el.sourceText.value.trim();
    if (!text) { showNotice("<b>Type or paste some text first.</b>"); return; }
    if (text.length > MAX_CHARS) { showNotice("<b>That's over the " + MAX_CHARS + "-character limit for a single translation.</b> Try splitting it up."); return; }

    state.translating = true;
    el.translateBtn.disabled = true;
    el.translateBtn.textContent = "Translating\u2026";
    el.outputArea.innerHTML = `<span class="output-placeholder">Translating\u2026</span>`;
    el.detectedLangPill.style.display = "none";
    el.copyOutputBtn.style.display = "none";

    const targetLanguage = el.targetLanguageSelect.value;

    try {
      const result = await window.AIGTranslateCore.translate(text, targetLanguage, { mode: "own-key", apiKey: state.apiKey });
      el.outputArea.textContent = result.translation;
      if (result.detectedLanguage && result.detectedLanguage !== "unknown") {
        el.detectedLangPill.textContent = "Detected: " + result.detectedLanguage;
        el.detectedLangPill.style.display = "inline-block";
      }
      el.copyOutputBtn.style.display = "inline-flex";

      state.history.unshift({
        sourceText: text, translation: result.translation,
        detectedLanguage: result.detectedLanguage, targetLanguage, at: new Date().toISOString()
      });
      saveHistory();
      renderHistory();
    } catch (err) {
      el.outputArea.innerHTML = `<span class="output-placeholder">Couldn't translate.</span>`;
      showNotice("<b>Couldn't get a translation:</b> " + escapeHtml(err.message));
    } finally {
      state.translating = false;
      el.translateBtn.disabled = false;
      el.translateBtn.textContent = "Translate";
    }
  }

  el.copyOutputBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(el.outputArea.textContent).catch(() => {});
    el.copyOutputBtn.textContent = "Copied!";
    setTimeout(() => { el.copyOutputBtn.textContent = "Copy"; }, 1500);
  });

  // ============================================================
  // History
  // ============================================================
  function renderHistory() {
    if (!state.history.length) { el.historyArea.innerHTML = ""; return; }
    el.historyArea.innerHTML = `<div class="panel-label" style="margin-bottom:8px;">Recent</div>` + state.history.slice(0, 8).map((h, i) => `
      <div class="history-item" data-idx="${i}">
        <div class="hl">${escapeHtml(h.detectedLanguage || "?")} &rarr; ${escapeHtml(h.targetLanguage)}</div>
        ${escapeHtml(h.sourceText.slice(0, 80))}${h.sourceText.length > 80 ? "\u2026" : ""}
      </div>`).join("");
    el.historyArea.querySelectorAll(".history-item").forEach(item => {
      item.addEventListener("click", () => {
        const h = state.history[parseInt(item.getAttribute("data-idx"), 10)];
        el.sourceText.value = h.sourceText;
        el.charCount.textContent = h.sourceText.length;
        el.targetLanguageSelect.value = h.targetLanguage;
        el.outputArea.textContent = h.translation;
        el.detectedLangPill.textContent = "Detected: " + h.detectedLanguage;
        el.detectedLangPill.style.display = "inline-block";
        el.copyOutputBtn.style.display = "inline-flex";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // ============================================================
  // Init
  // ============================================================
  applyKeyState();
  renderHistory();
})();
