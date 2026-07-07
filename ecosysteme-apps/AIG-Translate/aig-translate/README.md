# AIG Translate

Real translation powered by Claude — as a standalone page or an
embeddable widget for any site. Paste text, pick a target language, get
a translation with automatic source-language detection, no manual
language-pair selection needed.

## A note on how this came about

The initial spec for this app was, on inspection, Grammarly's actual
published marketing copy for their translation feature with "Grammarly"
replaced by "AIG" — matched word-for-word on searching it ("the
lightbulb next to the Grammarly button," "compatible with over 1 million
apps and websites," etc.). That's not something to reproduce or build
to, for two separate reasons:

1. **Copyright** — it's someone else's real marketing copy, not a
   generic description of a feature.
2. **Feasibility** — "appears wherever you type across 1 million apps
   and websites via a lightbulb icon" describes browser-extension /
   OS-level text-field integration, not something a standalone web app
   can do. That's a fundamentally different, much larger engineering
   project (real estate in a browser extension's content scripts
   running on arbitrary third-party pages) than anything else in the
   AIG app family.

What's here instead: a real, working translator using the same
own-key/backend architecture as AIG Ask — a standalone page, plus an
embeddable widget for your own site (which is honest about what it is:
a widget on your site, not a universal text-field overlay across the
web).

## Run it

```
python3 -m http.server 8000
```
Then open `http://localhost:8000` for the standalone page, or
`http://localhost:8000/demo-page.html` to see the widget on a sample
page.

## How translation actually works

One API call does both language detection and translation — Claude is
asked to identify the source language and translate in the same
request, returning structured JSON, so the UI can show "Detected:
French" without a second round-trip. If Claude's response doesn't
parse as valid JSON (it usually does, but LLM output isn't
byte-guaranteed), the app falls back to showing the raw response as the
translation rather than surfacing a confusing parse error — tested
directly by mocking a malformed response.

28 languages are in the target-language list — a real, reasonably broad
set of major world languages Claude translates well, not a number
copied from anywhere else.

## Getting an API key

Same as AIG Ask: this is the Anthropic API, billed separately from any
claude.ai subscription, pay-as-you-go. The onboarding screen walks
through creating a key at [console.anthropic.com](https://console.anthropic.com/).

## Widget configuration

```html
<script>
  window.AIGTranslateWidgetConfig = {
    mode: "own-key",              // "own-key" (default) or "backend"
    backendUrl: "",               // required if mode is "backend"
    defaultTargetLanguage: "English",
    position: "right"             // "right" or "left"
  };
</script>
<script src="core.js"></script>
<script src="widget.js"></script>
```

Same seam as AIG Ask: `own-key` works today with zero backend; `backend`
mode routes through your own server once one exists, with no visitor-
facing key prompt. The standalone page and widget share the same saved
API key on the same origin, so a visitor who sets it once isn't asked
again.

## Tested

- Full translate flow: real API request shape verified, structured
  JSON response correctly parsed into translation + detected language
- **Malformed-response fallback**: mocked a non-JSON Claude response
  and confirmed it displays as plain text instead of crashing or
  showing a raw parse error
- API error handling (401) shows a specific, actionable message
- Translation history: records correctly, clicking a past entry
  restores it
- Target language persists across the session
- **XSS safety, checked directly, not assumed**: mocked a translation
  response containing `<script>alert(1)</script>` and confirmed it
  renders as literal visible text in both the standalone app and the
  widget, never executes — translated text originates from an LLM
  response, so this needed verifying, not assuming
- Widget: onboarding → key save → translate flow, confirmed it doesn't
  interfere with host page content, confirmed mobile sizing with no
  overflow
- Mobile (390px touch viewport): both standalone app and widget, using
  real non-Latin text input (Japanese) to confirm character handling
  works correctly end to end, not just ASCII
- **Full mobile pass with real touch (`tap()`, not mouse simulation) on
  every interactive element**: onboarding, language dropdown, textarea
  input, Translate, Copy (verified the actual clipboard contents, not
  just that the button changed text), Clear, tapping a history entry to
  restore it, and the native `prompt()` dialog used for "set API key" —
  all confirmed working via touch. Specifically checked that a long,
  multi-sentence translation wraps correctly within the 390px-wide
  output panel instead of overflowing. Also tested the widget's
  first-time onboarding with a fresh browser context specifically (an
  initial combined test misleadingly seemed to skip onboarding, which
  turned out to be the intended shared-key behavior — the widget and
  standalone app share the same saved key on the same origin — correctly
  triggering because a key had already been saved earlier in that same
  test run; confirmed the real fresh-onboarding path separately).

## Files

```
index.html, app.js    standalone page: onboarding, translate UI, history
core.js                SHARED: the actual translation API call (both
                        modes) — used by both the standalone page and the widget
widget.js               embeddable widget: floating globe icon + panel,
                         injects into any host page with two script tags
demo-page.html          example host page with the widget embedded
```
