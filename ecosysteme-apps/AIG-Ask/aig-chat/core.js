// ============================================================
// AIG Ask — shared core.
//
// Both the standalone page (index.html/app.js) and the embeddable
// widget (widget.js) use this file for the two things that must stay
// identical between them: how a message actually gets sent, and how a
// reply gets rendered. Fixing a bug here fixes it in both places.
//
// ---- The "own key" vs "backend" seam ----
// AIGAskCore.sendMessage() is the ONLY place that knows how to reach
// Claude. Today it only supports "own-key" mode (call Anthropic
// directly with the visitor's own API key, stored in their browser).
// When a real backend exists, add a "backend" branch here that calls
// your endpoint instead — nothing in app.js or widget.js needs to
// change, since they only ever call AIGAskCore.sendMessage(messages,
// options) and don't know or care which mode is active.
// ============================================================

(function () {
  "use strict";

  const ANTHROPIC_VERSION = "2023-06-01";
  const MAX_TOKENS = 1024;

  /**
   * @param {Array<{role: 'user'|'assistant', content: string}>} messages
   * @param {{mode: 'own-key'|'backend', apiKey?: string, model?: string, backendUrl?: string}} options
   * @returns {Promise<string>} the assistant's reply text
   */
  async function sendMessage(messages, options) {
    const mode = options.mode || "own-key";

    if (mode === "own-key") {
      if (!options.apiKey) throw new Error("NO_API_KEY");
      return sendViaOwnKey(messages, options.model || "claude-sonnet-4-6", options.apiKey);
    }

    if (mode === "backend") {
      if (!options.backendUrl) throw new Error("Widget is configured for backend mode but no backendUrl was set.");
      return sendViaBackend(messages, options.model, options.backendUrl);
    }

    throw new Error("Unknown AIG Ask mode: " + mode);
  }

  async function sendViaOwnKey(messages, model, apiKey) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: MAX_TOKENS,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      })
    });

    if (!res.ok) {
      let detail = "";
      try {
        const body = await res.json();
        detail = body && body.error && body.error.message ? body.error.message : "";
      } catch (e) { /* response wasn't JSON */ }
      const statusHint = res.status === 401 ? " (check that your API key is correct)"
        : res.status === 429 ? " (rate limit or insufficient credit — check your Anthropic console billing)"
        : res.status === 529 ? " (Anthropic's API is temporarily overloaded — try again shortly)"
        : "";
      throw new Error("API error " + res.status + statusHint + (detail ? ": " + detail : ""));
    }

    const data = await res.json();
    const textBlock = (data.content || []).find(b => b.type === "text");
    if (!textBlock) throw new Error("Response had no text content.");
    return textBlock.text;
  }

  /**
   * Placeholder for when a real backend exists. Expected contract:
   * POST to backendUrl with {messages, model}, get back {reply: "..."}
   * or {error: "..."}. Adjust this to match whatever the actual backend
   * ends up expecting — this is a reasonable default shape, not a fixed
   * requirement.
   */
  async function sendViaBackend(messages, model, backendUrl) {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, model })
    });
    if (!res.ok) throw new Error("Backend error " + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (!data.reply) throw new Error("Backend response had no reply field.");
    return data.reply;
  }

  // ============================================================
  // Minimal markdown-ish rendering — bold, italics, inline code,
  // fenced code blocks, and bullet lists (including the common
  // "intro line, then bullets" pattern within one block).
  // ============================================================
  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function inlineFormat(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+?)`/g, "<code>$1</code>");
  }

  function renderMarkdownish(text) {
    const escaped = escapeHtml(text);
    const codeBlocks = [];
    const withPlaceholders = escaped.replace(/```([\s\S]*?)```/g, (_, code) => {
      codeBlocks.push(code.replace(/^\w*\n/, ""));
      return "\u0000CODEBLOCK" + (codeBlocks.length - 1) + "\u0000";
    });

    const paragraphs = withPlaceholders.split(/\n\n+/).map(p => {
      if (p.startsWith("\u0000CODEBLOCK")) return p;

      const lines = p.split("\n");
      const isBulletLine = l => /^[-*]\s/.test(l.trim());

      if (lines.some(isBulletLine)) {
        let html = "";
        let i = 0;
        while (i < lines.length) {
          if (isBulletLine(lines[i])) {
            let items = "";
            while (i < lines.length && isBulletLine(lines[i])) {
              items += "<li>" + inlineFormat(lines[i].trim().replace(/^[-*]\s/, "")) + "</li>";
              i++;
            }
            html += "<ul>" + items + "</ul>";
          } else {
            const textLine = lines[i].trim();
            if (textLine) html += "<p>" + inlineFormat(textLine) + "</p>";
            i++;
          }
        }
        return html;
      }

      return "<p>" + inlineFormat(p.replace(/\n/g, "<br>")) + "</p>";
    });

    return paragraphs.join("").replace(/\u0000CODEBLOCK(\d+)\u0000/g, (_, idx) => {
      return "<pre><code>" + escapeHtml(codeBlocks[parseInt(idx, 10)]).replace(/&amp;/g, "&") + "</code></pre>";
    });
  }

  window.AIGAskCore = { sendMessage, renderMarkdownish, escapeHtml };
})();
