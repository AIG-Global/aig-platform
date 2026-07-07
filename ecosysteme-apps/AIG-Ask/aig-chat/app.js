// ============================================================
// AIG Ask — a direct, standalone interface to Claude via the
// Anthropic API. No backend: every message goes straight from this
// browser to api.anthropic.com using the user's own API key, stored
// only in localStorage. This app and its author never see the key
// or the conversation content.
// ============================================================

(function () {
  "use strict";

  const KEY_STORAGE = "aigchat_api_key_v1";
  const MODEL_STORAGE = "aigchat_model_v1";

  const state = {
    apiKey: localStorage.getItem(KEY_STORAGE) || "",
    model: localStorage.getItem(MODEL_STORAGE) || "claude-sonnet-4-6",
    messages: [],   // {role: 'user'|'assistant', content: string}
    sending: false
  };

  const el = {
    statusLed: document.getElementById("statusLed"),
    statusText: document.getElementById("statusText"),
    modelSelect: document.getElementById("modelSelect"),
    newChatBtn: document.getElementById("newChatBtn"),
    setKeyBtn: document.getElementById("setKeyBtn"),
    onboardShell: document.getElementById("onboardShell"),
    onboardError: document.getElementById("onboardError"),
    onboardKeyInput: document.getElementById("onboardKeyInput"),
    onboardSaveBtn: document.getElementById("onboardSaveBtn"),
    chatShell: document.getElementById("chatShell"),
    chatLog: document.getElementById("chatLog"),
    messageInput: document.getElementById("messageInput"),
    sendBtn: document.getElementById("sendBtn"),
    keyModal: document.getElementById("keyModal"),
    closeKeyModalBtn: document.getElementById("closeKeyModalBtn"),
    keyModalInput: document.getElementById("keyModalInput"),
    keyModalSaveBtn: document.getElementById("keyModalSaveBtn"),
    keyModalClearBtn: document.getElementById("keyModalClearBtn")
  };

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }

  // Markdown rendering and the actual API call now live in core.js as
  // AIGAskCore.renderMarkdownish() and AIGAskCore.sendMessage(), shared
  // with the embeddable widget so a fix in one place fixes both.

  // ============================================================
  // Onboarding / key management
  // ============================================================
  function looksLikeKey(k) { return /^sk-ant-/.test(k.trim()); }

  function showOnboardError(msg) { el.onboardError.textContent = msg; el.onboardError.classList.add("show"); }
  function clearOnboardError() { el.onboardError.classList.remove("show"); }

  function applyKeyState() {
    const hasKey = !!state.apiKey;
    el.onboardShell.style.display = hasKey ? "none" : "flex";
    el.chatShell.style.display = hasKey ? "flex" : "none";
    if (hasKey) {
      el.statusLed.classList.add("live");
      el.statusLed.classList.remove("error");
      el.statusText.textContent = "key set";
    } else {
      el.statusLed.classList.remove("live");
      el.statusText.textContent = "no key set";
    }
  }

  function saveKey(rawKey) {
    const key = rawKey.trim();
    state.apiKey = key;
    localStorage.setItem(KEY_STORAGE, key);
    applyKeyState();
  }

  el.onboardSaveBtn.addEventListener("click", () => {
    clearOnboardError();
    const value = el.onboardKeyInput.value;
    if (!value.trim()) { showOnboardError("Paste your API key first."); return; }
    if (!looksLikeKey(value)) { showOnboardError("That doesn't look like an Anthropic API key — it should start with \u201csk-ant-\u201d."); return; }
    saveKey(value);
    if (!state.messages.length) renderEmptyState();
  });
  el.onboardKeyInput.addEventListener("keydown", e => { if (e.key === "Enter") el.onboardSaveBtn.click(); });

  function openKeyModal() {
    el.keyModalInput.value = state.apiKey;
    el.keyModal.classList.add("open");
  }
  function closeKeyModal() { el.keyModal.classList.remove("open"); }
  el.setKeyBtn.addEventListener("click", openKeyModal);
  el.closeKeyModalBtn.addEventListener("click", closeKeyModal);
  el.keyModal.addEventListener("click", e => { if (e.target === el.keyModal) closeKeyModal(); });
  el.keyModalSaveBtn.addEventListener("click", () => {
    const value = el.keyModalInput.value;
    if (!value.trim()) return;
    saveKey(value);
    closeKeyModal();
  });
  el.keyModalClearBtn.addEventListener("click", () => {
    state.apiKey = "";
    localStorage.removeItem(KEY_STORAGE);
    el.keyModalInput.value = "";
    applyKeyState();
    closeKeyModal();
  });

  // ============================================================
  // Model selection
  // ============================================================
  el.modelSelect.value = state.model;
  el.modelSelect.addEventListener("change", () => {
    state.model = el.modelSelect.value;
    localStorage.setItem(MODEL_STORAGE, state.model);
  });

  // ============================================================
  // Chat rendering
  // ============================================================
  const STARTER_PROMPTS = [
    "Explain a concept simply",
    "Help me draft an email",
    "Brainstorm ideas with me",
    "Help me debug some code"
  ];

  function renderEmptyState() {
    el.chatLog.innerHTML = `
      <div class="empty-chat">
        <div class="empty-chat-title">What's on your mind?</div>
        <div>Ask anything — this is a direct line to Claude.</div>
        <div class="starter-row" id="starterRow">
          ${STARTER_PROMPTS.map(p => `<button class="starter-chip" data-prompt="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join("")}
        </div>
      </div>`;
    document.querySelectorAll(".starter-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        el.messageInput.value = btn.getAttribute("data-prompt");
        updateSendButton();
        el.messageInput.focus();
      });
    });
  }

  function renderMessages() {
    if (!state.messages.length) { renderEmptyState(); return; }
    el.chatLog.innerHTML = state.messages.map((m, i) => {
      const isUser = m.role === "user";
      const bubbleContent = m.isError
        ? `<div class="msg-bubble msg-error-bubble">${escapeHtml(m.content)}</div>`
        : `<div class="msg-bubble">${isUser ? escapeHtml(m.content) : AIGAskCore.renderMarkdownish(m.content)}</div>`;
      return `
        <div class="msg-row ${isUser ? "user" : "assistant"}">
          <div class="msg-avatar ${isUser ? "user" : "assistant"}">${isUser ? "Y" : "C"}</div>
          ${bubbleContent}
        </div>`;
    }).join("");
    el.chatLog.scrollTop = el.chatLog.scrollHeight;
  }

  function appendTypingIndicator() {
    const row = document.createElement("div");
    row.className = "msg-row assistant";
    row.id = "typingRow";
    row.innerHTML = `
      <div class="msg-avatar assistant">C</div>
      <div class="msg-bubble"><div class="typing-row"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>`;
    el.chatLog.appendChild(row);
    el.chatLog.scrollTop = el.chatLog.scrollHeight;
  }
  function removeTypingIndicator() {
    const row = document.getElementById("typingRow");
    if (row) row.remove();
  }

  // ============================================================
  // Sending messages
  // ============================================================
  function updateSendButton() {
    const hasText = el.messageInput.value.trim().length > 0;
    el.sendBtn.disabled = !hasText || state.sending;
  }

  function autoGrowTextarea() {
    el.messageInput.style.height = "auto";
    el.messageInput.style.height = Math.min(160, el.messageInput.scrollHeight) + "px";
  }

  el.messageInput.addEventListener("input", () => { updateSendButton(); autoGrowTextarea(); });
  el.messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  });
  el.sendBtn.addEventListener("click", doSend);

  async function doSend() {
    const text = el.messageInput.value.trim();
    if (!text || state.sending) return;

    state.messages.push({ role: "user", content: text });
    el.messageInput.value = "";
    autoGrowTextarea();
    updateSendButton();
    renderMessages();

    state.sending = true;
    updateSendButton();
    appendTypingIndicator();

    try {
      const reply = await AIGAskCore.sendMessage(state.messages, { mode: "own-key", model: state.model, apiKey: state.apiKey });
      removeTypingIndicator();
      state.messages.push({ role: "assistant", content: reply });
      renderMessages();
    } catch (err) {
      removeTypingIndicator();
      state.messages.push({ role: "assistant", content: "Couldn't get a response: " + err.message, isError: true });
      renderMessages();
    } finally {
      state.sending = false;
      updateSendButton();
    }
  }

  // ============================================================
  // New chat
  // ============================================================
  el.newChatBtn.addEventListener("click", () => {
    if (state.messages.length && !confirm("Start a new chat? This clears the current conversation (it isn't saved anywhere once cleared).")) return;
    state.messages = [];
    renderMessages();
  });

  // ============================================================
  // Init
  // ============================================================
  applyKeyState();
  if (state.apiKey) renderEmptyState();
})();
