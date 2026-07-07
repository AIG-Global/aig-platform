// ============================================================
// AIG Ask — embeddable widget.
//
// Drop this into any page with:
//   <script src="core.js"></script>
//   <script src="widget.js"></script>
//
// It injects its own CSS and DOM (a floating icon, bottom-right, that
// expands into a chat panel) — no other markup is required on the host
// page. Optionally configure it BEFORE including this script:
//
//   <script>
//     window.AIGAskWidgetConfig = {
//       mode: "own-key",        // "own-key" (default) or "backend"
//       backendUrl: "",         // required if mode is "backend"
//       defaultModel: "claude-sonnet-4-6",
//       greeting: "Hi! Ask me anything about AIG.",
//       position: "right"       // "right" or "left"
//     };
//   </script>
//   <script src="core.js"></script>
//   <script src="widget.js"></script>
//
// Requires core.js to be loaded first (window.AIGAskCore).
// ============================================================

(function () {
  "use strict";

  if (!window.AIGAskCore) {
    console.error("AIG Ask widget: core.js must be loaded before widget.js");
    return;
  }

  const config = Object.assign({
    mode: "own-key",
    backendUrl: "",
    defaultModel: "claude-sonnet-4-6",
    greeting: "Hi! I'm AIG Ask. What can I help you with?",
    position: "right"
  }, window.AIGAskWidgetConfig || {});

  const KEY_STORAGE = "aigchat_api_key_v1";
  const MODEL_STORAGE = "aigchat_model_v1";

  // Some embedding contexts (sandboxed iframes, strict privacy modes,
  // some third-party-cookie-blocking setups) throw on localStorage
  // access entirely rather than just failing silently. Wrap it so the
  // widget still works in-memory-only for that page load instead of
  // crashing before it ever renders.
  const safeStorage = (function () {
    try {
      const testKey = "__aig_ask_storage_test__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return localStorage;
    } catch (e) {
      const mem = {};
      return {
        getItem: k => (k in mem ? mem[k] : null),
        setItem: (k, v) => { mem[k] = v; },
        removeItem: k => { delete mem[k]; }
      };
    }
  })();

  const state = {
    apiKey: safeStorage.getItem(KEY_STORAGE) || "",
    model: safeStorage.getItem(MODEL_STORAGE) || config.defaultModel,
    messages: [],
    sending: false,
    open: false
  };

  // ============================================================
  // Inject CSS (scoped under #aig-ask-widget-root to avoid colliding
  // with the host page's own styles)
  // ============================================================
  const style = document.createElement("style");
  style.textContent = `
    #aig-ask-widget-root, #aig-ask-widget-root * { box-sizing: border-box; }
    #aig-ask-widget-root {
      position: fixed; bottom: 24px; ${config.position === "left" ? "left" : "right"}: 24px;
      z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #aig-ask-widget-root .aw-bubble-btn {
      width: 58px; height: 58px; border-radius: 50%; background: #e8a33d; border: none; cursor: pointer;
      box-shadow: 0 4px 18px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s ease;
    }
    #aig-ask-widget-root .aw-bubble-btn:hover { transform: scale(1.06); }
    #aig-ask-widget-root .aw-bubble-btn svg { width: 26px; height: 26px; color: #1a1206; }
    #aig-ask-widget-root .aw-panel {
      position: absolute; bottom: 72px; ${config.position === "left" ? "left" : "right"}: 0;
      width: 360px; height: 520px; max-height: 80vh; background: #0a0d12; border: 1px solid #262c36;
      border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.5); display: none;
      flex-direction: column; overflow: hidden;
    }
    #aig-ask-widget-root .aw-panel.aw-open { display: flex; }
    #aig-ask-widget-root .aw-header {
      background: #12161d; border-bottom: 1px solid #262c36; padding: 12px 14px;
      display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    }
    #aig-ask-widget-root .aw-brand { display: flex; align-items: center; gap: 8px; color: #e4e7eb; font-weight: 600; font-size: 13.5px; }
    #aig-ask-widget-root .aw-brand .aw-dot { width: 7px; height: 7px; border-radius: 50%; background: #e8a33d; }
    #aig-ask-widget-root .aw-header-actions { display: flex; gap: 6px; }
    #aig-ask-widget-root .aw-icon-btn {
      width: 26px; height: 26px; border-radius: 5px; background: none; border: none; color: #9099a8;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    #aig-ask-widget-root .aw-icon-btn:hover { background: #1c2129; color: #e4e7eb; }
    #aig-ask-widget-root .aw-icon-btn svg { width: 15px; height: 15px; }
    #aig-ask-widget-root .aw-body { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 12px; min-height: 0; }
    #aig-ask-widget-root .aw-msg-row { display: flex; gap: 8px; }
    #aig-ask-widget-root .aw-msg-row.aw-user { flex-direction: row-reverse; }
    #aig-ask-widget-root .aw-avatar {
      width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center;
      justify-content: center; font-size: 9.5px; font-weight: 700;
    }
    #aig-ask-widget-root .aw-avatar.aw-assistant { background: #5c4520; color: #e8a33d; }
    #aig-ask-widget-root .aw-avatar.aw-user { background: #1c2129; color: #9099a8; }
    #aig-ask-widget-root .aw-bubble { max-width: 78%; padding: 9px 12px; border-radius: 9px; font-size: 13px; line-height: 1.5; color: #e4e7eb; }
    #aig-ask-widget-root .aw-msg-row.aw-assistant .aw-bubble { background: #12161d; border: 1px solid #262c36; border-top-left-radius: 3px; }
    #aig-ask-widget-root .aw-msg-row.aw-user .aw-bubble { background: #e8a33d; color: #1a1206; border-top-right-radius: 3px; font-weight: 500; }
    #aig-ask-widget-root .aw-bubble p { margin: 0 0 8px; }
    #aig-ask-widget-root .aw-bubble p:last-child { margin-bottom: 0; }
    #aig-ask-widget-root .aw-bubble code { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; background: rgba(0,0,0,0.25); padding: 1px 4px; border-radius: 3px; }
    #aig-ask-widget-root .aw-bubble pre { background: rgba(0,0,0,0.25); padding: 8px 10px; border-radius: 5px; overflow-x: auto; font-size: 11.5px; margin: 6px 0; }
    #aig-ask-widget-root .aw-bubble ul { margin: 4px 0 8px; padding-left: 18px; }
    #aig-ask-widget-root .aw-error-bubble { background: rgba(211,104,95,0.12); border: 1px solid #d3685f; color: #f0a39c; }
    #aig-ask-widget-root .aw-typing { display: flex; gap: 4px; padding: 4px 0; }
    #aig-ask-widget-root .aw-typing span { width: 5px; height: 5px; border-radius: 50%; background: #5a626f; animation: aw-pulse 1.2s infinite ease-in-out; }
    #aig-ask-widget-root .aw-typing span:nth-child(2) { animation-delay: 0.2s; }
    #aig-ask-widget-root .aw-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes aw-pulse { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
    #aig-ask-widget-root .aw-input-bar { border-top: 1px solid #262c36; padding: 10px; display: flex; gap: 8px; flex-shrink: 0; }
    #aig-ask-widget-root .aw-input-bar textarea {
      flex: 1; resize: none; max-height: 80px; min-height: 36px; background: #1c2129; border: 1px solid #262c36;
      color: #e4e7eb; font-size: 13px; padding: 8px 11px; border-radius: 6px; font-family: inherit; line-height: 1.4;
    }
    #aig-ask-widget-root .aw-input-bar textarea:focus { outline: none; border-color: #e8a33d; }
    #aig-ask-widget-root .aw-send-btn {
      width: 36px; height: 36px; border-radius: 6px; background: #e8a33d; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    #aig-ask-widget-root .aw-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    #aig-ask-widget-root .aw-send-btn svg { width: 16px; height: 16px; color: #1a1206; }
    #aig-ask-widget-root .aw-onboard { padding: 18px; font-size: 12.5px; color: #9099a8; line-height: 1.6; overflow-y: auto; flex: 1; }
    #aig-ask-widget-root .aw-onboard h4 { color: #e4e7eb; font-size: 14px; margin: 0 0 8px; }
    #aig-ask-widget-root .aw-onboard input {
      width: 100%; background: #1c2129; border: 1px solid #262c36; color: #e4e7eb; font-size: 12.5px;
      padding: 9px 11px; border-radius: 5px; margin: 10px 0; font-family: 'IBM Plex Mono', monospace;
    }
    #aig-ask-widget-root .aw-onboard input:focus { outline: none; border-color: #e8a33d; }
    #aig-ask-widget-root .aw-onboard button {
      width: 100%; background: #e8a33d; color: #1a1206; border: none; font-weight: 600; font-size: 13px;
      padding: 10px; border-radius: 6px; cursor: pointer;
    }
    #aig-ask-widget-root .aw-onboard-error { background: rgba(211,104,95,0.12); border: 1px solid #d3685f; color: #f0a39c; font-size: 11.5px; padding: 8px 10px; border-radius: 4px; margin-bottom: 10px; display: none; }
    #aig-ask-widget-root .aw-onboard-error.aw-show { display: block; }
    #aig-ask-widget-root .aw-onboard a { color: #5fa8d3; }
    @media (max-width: 480px) {
      #aig-ask-widget-root .aw-panel { width: calc(100vw - 32px); right: -8px; }
    }
  `;
  document.head.appendChild(style);

  // ============================================================
  // Inject DOM
  // ============================================================
  const root = document.createElement("div");
  root.id = "aig-ask-widget-root";
  root.innerHTML = `
    <div class="aw-panel" id="awPanel">
      <div class="aw-header">
        <div class="aw-brand"><span class="aw-dot"></span>AIG ASK</div>
        <div class="aw-header-actions">
          <button class="aw-icon-btn" id="awNewChatBtn" title="New chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 4v4h4"/></svg>
          </button>
          <button class="aw-icon-btn" id="awCloseBtn" title="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
      </div>
      <div class="aw-body" id="awBody"></div>
      <div class="aw-input-bar" id="awInputBar" style="display:none;">
        <textarea id="awInput" placeholder="Ask a question…" rows="1"></textarea>
        <button class="aw-send-btn" id="awSendBtn" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
        </button>
      </div>
    </div>
    <button class="aw-bubble-btn" id="awBubbleBtn" aria-label="Open AIG Ask">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.04 2 11c0 2.4 1.07 4.57 2.82 6.18-.1.99-.5 2.6-1.32 4.32-.1.22.1.46.34.4 2.04-.5 3.54-1.27 4.4-1.8C9.34 20.7 10.64 21 12 21c5.52 0 10-4.04 10-9s-4.48-9-10-9z"/></svg>
    </button>
  `;
  document.body.appendChild(root);

  const el = {
    panel: document.getElementById("awPanel"),
    body: document.getElementById("awBody"),
    inputBar: document.getElementById("awInputBar"),
    input: document.getElementById("awInput"),
    sendBtn: document.getElementById("awSendBtn"),
    bubbleBtn: document.getElementById("awBubbleBtn"),
    closeBtn: document.getElementById("awCloseBtn"),
    newChatBtn: document.getElementById("awNewChatBtn")
  };

  // ============================================================
  // Open / close
  // ============================================================
  function setOpen(open) {
    state.open = open;
    el.panel.classList.toggle("aw-open", open);
    if (open) renderBody();
  }
  el.bubbleBtn.addEventListener("click", () => setOpen(!state.open));
  el.closeBtn.addEventListener("click", () => setOpen(false));

  // ============================================================
  // Rendering — either the own-key onboarding form, or the chat itself
  // ============================================================
  function renderBody() {
    const needsKey = config.mode === "own-key" && !state.apiKey;
    el.inputBar.style.display = needsKey ? "none" : "flex";
    if (needsKey) {
      renderOnboard();
    } else {
      renderMessages();
    }
  }

  function renderOnboard() {
    el.body.innerHTML = `
      <div class="aw-onboard">
        <h4>Connect an API key</h4>
        <p>AIG Ask talks directly to Claude using your own Anthropic API key, stored only in your browser. Get one at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>.</p>
        <div class="aw-onboard-error" id="awOnboardError"></div>
        <input type="password" id="awOnboardKeyInput" placeholder="sk-ant-...">
        <button id="awOnboardSaveBtn">Save key &amp; start chatting</button>
      </div>`;
    document.getElementById("awOnboardSaveBtn").addEventListener("click", () => {
      const input = document.getElementById("awOnboardKeyInput");
      const errorEl = document.getElementById("awOnboardError");
      const value = input.value.trim();
      if (!value) { errorEl.textContent = "Paste your API key first."; errorEl.classList.add("aw-show"); return; }
      if (!/^sk-ant-/.test(value)) { errorEl.textContent = "That doesn't look like an Anthropic key (should start with sk-ant-)."; errorEl.classList.add("aw-show"); return; }
      state.apiKey = value;
      safeStorage.setItem(KEY_STORAGE, value);
      renderBody();
    });
    document.getElementById("awOnboardKeyInput").addEventListener("keydown", e => {
      if (e.key === "Enter") document.getElementById("awOnboardSaveBtn").click();
    });
  }

  function renderMessages() {
    if (!state.messages.length) {
      el.body.innerHTML = `
        <div class="aw-msg-row aw-assistant">
          <div class="aw-avatar aw-assistant">C</div>
          <div class="aw-bubble">${AIGAskCore.escapeHtml(config.greeting)}</div>
        </div>`;
      return;
    }
    el.body.innerHTML = state.messages.map(m => {
      const isUser = m.role === "user";
      const cls = m.isError ? "aw-bubble aw-error-bubble" : "aw-bubble";
      const content = m.isError || isUser ? AIGAskCore.escapeHtml(m.content) : AIGAskCore.renderMarkdownish(m.content);
      return `
        <div class="aw-msg-row ${isUser ? "aw-user" : "aw-assistant"}">
          <div class="aw-avatar ${isUser ? "aw-user" : "aw-assistant"}">${isUser ? "Y" : "C"}</div>
          <div class="${cls}">${content}</div>
        </div>`;
    }).join("");
    el.body.scrollTop = el.body.scrollHeight;
  }

  function appendTyping() {
    const row = document.createElement("div");
    row.className = "aw-msg-row aw-assistant";
    row.id = "awTypingRow";
    row.innerHTML = `<div class="aw-avatar aw-assistant">C</div><div class="aw-bubble"><div class="aw-typing"><span></span><span></span><span></span></div></div>`;
    el.body.appendChild(row);
    el.body.scrollTop = el.body.scrollHeight;
  }
  function removeTyping() {
    const row = document.getElementById("awTypingRow");
    if (row) row.remove();
  }

  // ============================================================
  // Sending
  // ============================================================
  function updateSendBtn() {
    el.sendBtn.disabled = !el.input.value.trim() || state.sending;
  }
  el.input.addEventListener("input", () => {
    updateSendBtn();
    el.input.style.height = "auto";
    el.input.style.height = Math.min(80, el.input.scrollHeight) + "px";
  });
  el.input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); }
  });
  el.sendBtn.addEventListener("click", doSend);

  async function doSend() {
    const text = el.input.value.trim();
    if (!text || state.sending) return;
    state.messages.push({ role: "user", content: text });
    el.input.value = "";
    el.input.style.height = "auto";
    updateSendBtn();
    renderMessages();

    state.sending = true;
    updateSendBtn();
    appendTyping();

    try {
      const reply = await AIGAskCore.sendMessage(state.messages, {
        mode: config.mode,
        model: state.model,
        apiKey: state.apiKey,
        backendUrl: config.backendUrl
      });
      removeTyping();
      state.messages.push({ role: "assistant", content: reply });
      renderMessages();
    } catch (err) {
      removeTyping();
      state.messages.push({ role: "assistant", content: "Couldn't get a response: " + err.message, isError: true });
      renderMessages();
    } finally {
      state.sending = false;
      updateSendBtn();
    }
  }

  el.newChatBtn.addEventListener("click", () => {
    if (state.messages.length && !confirm("Start a new chat?")) return;
    state.messages = [];
    renderMessages();
  });
})();
