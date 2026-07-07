# AIG Investor Alerts — cross-market research terminal

A research dashboard for studying correlation between crypto, stocks, and
commodities, with real price data, real headline context, transparent
fundamentals-based grading, and optional AI-generated plain-language
summaries. No trading, no recommendations, no fabricated performance claims —
every number on screen is either fetched directly from a real data source or
computed from those numbers with the formula visible.

**Investing always carries risk — AI-assisted or not, in stocks, crypto, or
commodities. This tool provides data and analysis for informed investors; it
does not provide investment advice or guarantee any outcome.** The app shows
this same message permanently in its header banner, and every account must
explicitly acknowledge a fuller risk disclosure as part of creating an
account — registration is blocked without it.

## Accounts — local stand-in for a real backend, by design

This is a personal tool: each person has their own account, their own
watchlist, and their own saved API keys. There's no backend yet, so accounts
today are implemented in `auth.js` against `localStorage` — but every
function in that file (`register`, `login`, `logout`, `getCurrentUser`) is
async and shaped exactly like a real network call would be, specifically so
a real backend can be swapped in later by rewriting `auth.js` alone, without
touching `index.html`'s auth screen or `app.js`'s app logic.

**What this means in practice right now:**
- Accounts, watchlists, and API keys are stored only in the browser they were
  created in — they will not appear on a different browser or device.
- Passwords are hashed (SHA-256) before being stored, but this is **not**
  real security — there's no salting, no rate limiting, no server-side
  protection of any kind. Treat every account created today as a local demo
  account, not a secure one, until a real backend replaces `auth.js`.
- Registration requires checking a box that links to the full risk
  disclosure; the checkbox is a native HTML5 `required` field, so the form
  cannot be submitted without it. The acknowledgment, with a timestamp, is
  stored on the user's record — the same field a real backend should persist
  for audit purposes.
- Each user's data is namespaced by email via `AIGAuth.scopedKey()`, so two
  accounts in the same browser never see each other's watchlist or keys.
  Verified directly: registering a second account starts with the default
  watchlist, and signing back into the first account still has whatever was
  added there.

## IMPORTANT — you must run this from a local server, not double-click it

Browsers block live API calls (CoinGecko, Alpha Vantage, Finnhub, the news
proxy — all of them) from a page opened directly as a `file://` URL. This
isn't specific to this app; it's how every browser treats local files for
security reasons. If you just double-click `index.html`, the app will show a
banner explaining this and nothing will load.

**Fix — from a terminal, inside this folder:**
```
python3 -m http.server 8000
```
or, if you have Node:
```
npx serve
```
Then open `http://localhost:8000` in your browser. That's it — no build step,
no dependencies to install for the app itself.

## What's real here

- **Crypto prices, 24h change, and 30-day history**: live from CoinGecko's
  public API. No key, no signup, works the moment you load the page (over a
  local server — see above).
- **Stock/index prices, history, and fundamentals**: real, but require your
  own free API key from Alpha Vantage or Finnhub (click "set stock API key"
  in the top bar). The key is stored only in your browser's local storage —
  it's sent directly to whichever provider you choose, never anywhere else.
  Free tiers are rate-limited (Alpha Vantage ~25 requests/day, Finnhub
  ~60/minute), which is the most common cause of a stock not loading.
- **News headlines**: pulled from Google News RSS through a public CORS
  proxy (`allorigins.win`). This is best-effort — that proxy has no SLA and
  can be slow or rate-limited. If headlines don't load, the panel says so
  plainly rather than showing fake ones.
- **Correlation**: real Pearson correlation computed on day-over-day returns
  (not raw prices, which would overstate correlation from shared trend/drift)
  across whatever price history successfully loaded for each asset.
- **Relative grades**: percentile rank of each stock's P/E, revenue growth,
  and net margin *against the other stocks currently on your watchlist* —
  explicitly not a sector or market-wide benchmark, because that data isn't
  available without a paid feed. The panel says this directly.
- **Correlation alerts**: the same Pearson math, surfaced proactively when
  any pair's correlation crosses |r| ≥ 0.7.
- **AI summaries** (optional): click "set AI key" to add your own Anthropic
  API key (from console.anthropic.com), stored only in your browser and sent
  directly to Anthropic, never anywhere else. When enabled, an asset's detail
  panel gets a "Generate" button that sends the data already shown (price,
  change, correlation list, grade) to Claude and asks for a plain-language
  summary of it — explicitly instructed not to predict or recommend anything,
  and every summary ends with a fixed disclaimer sentence. The model only
  ever sees numbers this app already fetched; it has no separate access to
  the market and can't introduce information you don't already have on
  screen.

## What's NOT here, on purpose

No buy/sell recommendations, no "AI score," no claimed track record or
backtested performance, no investment advice. Past correlation between two
assets says nothing about whether that relationship will hold going forward —
the footer says so on every page load.

## Files

```
index.html   structure, styling, layout, the sign-in/registration hero
             background (inline SVG), and the auth-screen bootstrap script
auth.js      account registration/login/logout — the file to replace with
             real backend calls when one exists
app.js       all data fetching, correlation math, grading logic, rendering
```

The sign-in/registration screen has an inline SVG background — a network of
glowing nodes tracing an ascending trend, plus a few rising bars — in the
app's own amber/blue palette. It's decorative only, scales cleanly at any
screen size via `preserveAspectRatio="xMidYMid slice"`, and adds no external
image requests (no extra load time, nothing that can fail to load).

## Mobile

Works on phone-sized screens — tested at a 390px-wide viewport (iPhone-class)
with touch enabled: sign-in, registration with the risk checkbox, and the
full dashboard all render in a single readable column with no horizontal
overflow. The topbar's status indicators and account controls wrap onto
multiple lines instead of forcing the page wider than the screen.

Everything is vanilla JS — no build step, no framework, no npm install needed
to run it (only the optional local server above).

## Extending this

- `fetchStockQuote` / `fetchStockHistory` / `fetchFundamentals` in `app.js`
  are where the two stock providers are implemented — adding a third
  provider means adding one more branch in each.
- `pearsonCorrelation` and `computeGrades` are pure functions over already-
  fetched data, so they're straightforward to unit test or extend (e.g. a
  longer lookback window, or more fundamentals fields) without touching the
  network code.

## Swapping in a real backend for auth

`auth.js` exposes exactly four functions on `window.AIGAuth`:
`register({email, password, riskAcknowledged})`, `login({email, password})`,
`logout()`, and `getCurrentUser()` — plus `scopedKey(baseKey)`, which
namespaces a localStorage key to whoever's currently logged in.

To move to a real backend:
1. Rewrite the bodies of `register`/`login`/`logout`/`getCurrentUser` to call
   your actual API instead of touching `localStorage` directly (e.g.
   `fetch("/api/auth/register", {method: "POST", body: ...})`), keeping the
   same parameter shapes and return values (`{email}` on success, throw with
   a human-readable message on failure).
2. `getCurrentUser()` should check whatever session mechanism your backend
   uses (an httpOnly cookie, a token in memory, etc.) instead of reading a
   local session key.
3. Decide what `scopedKey()` should do once data lives server-side — most
   likely you'll replace the watchlist/key `localStorage` calls in `app.js`
   with real API calls too at that point, rather than keeping them local but
   "scoped." `scopedKey()` exists today specifically to make that boundary
   obvious and contained to a handful of call sites.
4. Nothing in `index.html`'s auth screen or `app.js` needs to change for any
   of this — they only ever call the four functions above.
