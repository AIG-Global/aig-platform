# AIG Ask — a direct line to Claude

A standalone chatbot **and** an embeddable widget, both talking directly
to Anthropic's Claude API. No backend required today — messages go
straight from the browser to `api.anthropic.com` and back, using the
visitor's own API key. The widget is architected so a future shared
backend (no per-visitor key needed) is a config change, not a rewrite.

## Two ways to use this

**Standalone page** (`index.html` + `app.js`) — a full-page chat
interface, same as before.

**Embeddable widget** (`widget.js`) — a floating icon that drops into the
bottom-right corner of any page and expands into a chat panel. Add it to
any AIG page with two script tags and nothing else:
```html
<script src="core.js"></script>
<script src="widget.js"></script>
```
See `demo-page.html` for a working example of a normal page with the
widget embedded — open it the same way as the other files (served over
HTTP, not double-clicked).

Both share the same logic (API calls, markdown rendering) via `core.js`,
so a fix in one place fixes both.

## Run it

No build step. From this folder:
```
python3 -m http.server 8000
```
Then open `http://localhost:8000` for the standalone page, or
`http://localhost:8000/demo-page.html` to see the widget on a sample
page. (Same `file://` CORS restriction as the other AIG apps applies here
too — must be served over HTTP.)

## Widget configuration

Set `window.AIGAskWidgetConfig` **before** the `core.js`/`widget.js`
script tags to customize behavior:

```html
<script>
  window.AIGAskWidgetConfig = {
    mode: "own-key",              // "own-key" (default) or "backend"
    backendUrl: "",               // required if mode is "backend"
    defaultModel: "claude-sonnet-4-6",
    greeting: "Hi! Ask me anything about AIG.",
    position: "right"             // "right" or "left"
  };
</script>
<script src="core.js"></script>
<script src="widget.js"></script>
```

**`mode: "own-key"`** (today's default) — each visitor pastes their own
Anthropic API key into the widget the first time they open it, stored
only in their browser. No backend needed; works today, as-is.

**`mode: "backend"`** (for later) — the widget calls `backendUrl` instead
of Anthropic directly, sending `{messages, model}` and expecting back
`{reply: "..."}`. No visitor ever sees a key prompt in this mode, since
the shared key would live server-side instead. **This requires building
that backend first** — `mode: "backend"` alone doesn't create one, it
just tells the widget where to send requests once one exists. The
contract (`sendViaBackend` in `core.js`) is a reasonable default shape,
not a fixed requirement — adjust it to match whatever the real backend
ends up expecting.

Switching between modes later is a one-line config change. Nothing in
`widget.js` itself needs to change either way — the mode-switching logic
already lives in `core.js`'s `AIGAskCore.sendMessage()`.

## Getting an API key

This is a **separate thing from a claude.ai subscription** — the API is
pay-as-you-go, billed per token. The app's onboarding screen walks through
it, but in short:
1. Sign up at [console.anthropic.com](https://console.anthropic.com/)
2. Add a payment method under Billing
3. Create a key under Settings → API Keys (starts with `sk-ant-`)
4. Paste it into AIG Ask

Typical chat usage costs a few cents per conversation — nowhere near
subscription pricing, but real usage does cost real money since there's
no free tier on the API itself.

## How it works

- Every message sends the **full conversation history** to the API (the
  API itself is stateless between calls — this app's `state.messages`
  array is what makes it feel like a continuous conversation).
- Responses are rendered through a small built-in markdown-ish renderer
  (bold, italics, inline code, fenced code blocks, bullet lists) — not a
  full markdown library, since this is a single-file app, but it handles
  normal chat replies correctly. Tested specifically on the common
  "intro sentence, then a bullet list" pattern, which a naive line-start-only
  bullet detector misses — fixed and verified.
- API errors surface with a specific, useful message rather than just
  "something went wrong": a 401 tells you to check your key, 429 points
  at rate limits or billing, 529 explains Anthropic's API is temporarily
  overloaded.
- "New chat" clears the conversation. Nothing is persisted between
  sessions except your API key and selected model — conversations
  themselves are not saved anywhere, by design (there's no backend to
  save them to, and this app doesn't use localStorage for chat history).

## Privacy

Your API key lives only in this browser's `localStorage`. It's sent on
every request directly to `api.anthropic.com` via the `x-api-key` header
— never to any other server, including not to whoever built this app.
Clearing browser data, or opening the app in a different browser or
device, means setting the key again.

The standalone page and the widget share the same `localStorage` key
(`aigchat_api_key_v1`) when running on the same origin/domain — so a
visitor who sets their key once on the full chat page won't be asked
again by the widget elsewhere on the same site, and vice versa.

## Models

Three current models are selectable from the top bar:
`claude-sonnet-4-6` (default — balanced), `claude-opus-4-6` (most
capable, costs more), `claude-haiku-4-5` (fastest, cheapest). Model
availability and pricing can change — check
[docs.claude.com](https://docs.claude.com) for the current lineup if
something stops working.

## Files

```
index.html       standalone page: structure, styling, onboarding flow, chat layout
app.js            standalone page logic: onboarding UI, conversation state, rendering
core.js           SHARED: the actual Anthropic API call (both modes), markdown
                  rendering — used by both index.html/app.js and widget.js
widget.js         the embeddable widget: injects its own CSS + floating icon +
                  panel into any host page, no markup required on that page
demo-page.html    example of a normal page with the widget embedded
```

## Tested

**Standalone page:**
- Invalid-looking key rejected before ever calling the API
- Full onboarding → chat flow
- Conversation history correctly accumulates and is sent in full on each
  turn (verified the actual request body, not just the UI)
- Markdown rendering: bold, inline code, and bullet lists — including the
  "text then list in the same block" pattern that an earlier version of
  the renderer got wrong
- API error handling (401) surfaces a specific, actionable message
- New chat clears state correctly
- Clearing the key returns to onboarding
- Mobile (390px) layout — bubbles, input bar, and topbar all reflow
  correctly with no overflow
- **Found and fixed a real mobile bug**: the onboarding card used
  flexbox vertical centering (`align-items: center`); on a phone screen,
  the 4-step setup card is taller than the available space below the
  topbar, and centering pushed its top portion (the heading and intro
  paragraph) up behind the sticky topbar — invisible, not just
  scrolled-past. Switched to top-aligned with scroll
  (`align-items: flex-start`), confirmed the heading now renders well
  below the topbar with no overlap, and re-confirmed desktop still looks
  correctly centered (the fix only changes behavior when content is
  taller than the viewport).
- Refactor to shared `core.js` re-verified with zero behavior change

**Widget:**
- Injects correctly into a host page with no interference with that
  page's own content
- Floating icon → panel open/close
- Onboarding (own-key mode): invalid key rejected, valid key accepted,
  input bar only appears once a key is set
- Sending a message produces the correct request and renders the reply
  with markdown
- Conversation state persists across closing and reopening the panel
  within the same page session
- New chat clears messages
- **Backend mode** (`mode: "backend"`): verified the widget skips the key
  prompt entirely and calls the configured `backendUrl` with the right
  payload when that mode is set — confirmed against a mocked backend
  endpoint
- Hardened against `localStorage` being unavailable (sandboxed iframes,
  strict privacy modes, some third-party-cookie-blocking setups can throw
  on access rather than just failing quietly) — falls back to in-memory
  storage for that page load instead of crashing before the widget renders
- Mobile (390px) — panel resizes to fit viewport width with no horizontal
  overflow
