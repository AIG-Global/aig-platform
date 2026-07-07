// ============================================================
// AIG Translate — shared core.
//
// Real translation via the Anthropic API — not a lookup table, not a
// hardcoded phrasebook. One call does both language detection and
// translation, asking Claude to return structured JSON so the UI can
// show "Detected: French" without a second round-trip.
//
// Same own-key/backend seam as AIG Ask: today, each user brings their
// own Anthropic API key (works right now, no backend needed). Set
// TranslateConfig.backendUrl later to route through a shared backend
// instead — nothing else in app.js/widget.js needs to change.
// ============================================================

(function () {
  "use strict";

  const ANTHROPIC_VERSION = "2023-06-01";
  const MAX_TOKENS = 2048;

  const SUPPORTED_LANGUAGES = [
    "Arabic", "Bengali", "Chinese (Simplified)", "Chinese (Traditional)", "Czech",
    "Danish", "Dutch", "English", "Finnish", "French", "German", "Greek",
    "Hebrew", "Hindi", "Indonesian", "Italian", "Japanese", "Korean",
    "Norwegian", "Polish", "Portuguese", "Russian", "Spanish", "Swedish",
    "Thai", "Turkish", "Ukrainian", "Vietnamese"
  ];

  /**
   * @param {string} text - the text to translate
   * @param {string} targetLanguage - one of SUPPORTED_LANGUAGES
   * @param {{mode: 'own-key'|'backend', apiKey?: string, model?: string, backendUrl?: string}} options
   * @returns {Promise<{detectedLanguage: string, translation: string}>}
   */
  async function translate(text, targetLanguage, options) {
    const mode = options.mode || "own-key";
    if (mode === "own-key") {
      if (!options.apiKey) throw new Error("NO_API_KEY");
      return translateViaOwnKey(text, targetLanguage, options.model || "claude-sonnet-4-6", options.apiKey);
    }
    if (mode === "backend") {
      if (!options.backendUrl) throw new Error("Widget is configured for backend mode but no backendUrl was set.");
      return translateViaBackend(text, targetLanguage, options.backendUrl);
    }
    throw new Error("Unknown AIG Translate mode: " + mode);
  }

  function buildPrompt(text, targetLanguage) {
    return "Detect the language of the following text, then translate it into " + targetLanguage + ".\n\n"
      + "Respond with ONLY a JSON object, no markdown fences, no other text, in exactly this shape:\n"
      + '{"detectedLanguage": "<name of the detected source language>", "translation": "<the translation>"}\n\n'
      + "Preserve the tone, register, and intent of the original as closely as natural " + targetLanguage + " phrasing allows. "
      + "If the text is already in " + targetLanguage + ", still return it (lightly polished if it reads awkwardly) rather than refusing.\n\n"
      + "Text to translate:\n" + text;
  }

  function parseTranslationResponse(rawText) {
    let cleaned = rawText.trim().replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "");
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      // Fall back to treating the whole reply as the translation if Claude
      // didn't follow the JSON format exactly — better than surfacing a
      // raw parse error to someone just trying to translate a sentence.
      return { detectedLanguage: "unknown", translation: rawText.trim() };
    }
    if (!parsed.translation) throw new Error("Response was missing a translation.");
    return { detectedLanguage: parsed.detectedLanguage || "unknown", translation: parsed.translation };
  }

  async function translateViaOwnKey(text, targetLanguage, model, apiKey) {
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
        messages: [{ role: "user", content: buildPrompt(text, targetLanguage) }]
      })
    });

    if (!res.ok) {
      let detail = "";
      try {
        const body = await res.json();
        detail = body && body.error && body.error.message ? body.error.message : "";
      } catch (e) { /* not JSON */ }
      const statusHint = res.status === 401 ? " (check that your API key is correct)"
        : res.status === 429 ? " (rate limit or insufficient credit — check your Anthropic console billing)"
        : res.status === 529 ? " (Anthropic's API is temporarily overloaded — try again shortly)"
        : "";
      throw new Error("API error " + res.status + statusHint + (detail ? ": " + detail : ""));
    }

    const data = await res.json();
    const textBlock = (data.content || []).find(b => b.type === "text");
    if (!textBlock) throw new Error("Response had no text content.");
    return parseTranslationResponse(textBlock.text);
  }

  /**
   * Placeholder for when a real backend exists — same contract shape as
   * AIG Ask's backend mode. Expected: POST {text, targetLanguage}, get
   * back {detectedLanguage, translation} or {error}.
   */
  async function translateViaBackend(text, targetLanguage, backendUrl) {
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage })
    });
    if (!res.ok) throw new Error("Backend error " + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (!data.translation) throw new Error("Backend response had no translation field.");
    return data;
  }

  window.AIGTranslateCore = { translate, SUPPORTED_LANGUAGES };
})();
