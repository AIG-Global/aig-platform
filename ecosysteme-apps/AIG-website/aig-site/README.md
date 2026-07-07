# AIG — website prototype

A static, fully working website for AIG: an AI personal assistant paired with the
WDM marketplace. Black-and-gold "engraved luxury" visual identity. No build step —
open the HTML files directly in a browser, or serve the folder with any static
file server.

## What this deliberately does NOT include

This prototype is scoped to exclude the multi-level recruitment commission
structure, membership-tier earning caps, and token-yield mechanics present in
earlier drafts of the AIG/WDM concept. Specifically:

- The account balance (`dashboard.html`) is plain store credit — no yield, no
  investment framing, convertible to a bank account 1:1 at any time.
- The referral program is a flat, one-time €20 credit per successful referral —
  no levels, no downline, no ongoing commission.
- There are no membership packages that unlock different earning caps.

If you want any of that re-introduced, you'll need a different build — this one is
intentionally a plain assistant + marketplace product.

## Pages

- `index.html` — marketing homepage (hero, features, account balance explainer,
  marketplace preview, pricing preview, CTA)
- `marketplace.html` — WDM marketplace catalog with category filters and a detail
  modal per listing
- `pricing.html` — plans, the flat referral program, and an FAQ section
- `dashboard.html` — the logged-in experience: overview, account balance (top up /
  convert to bank), orders, referral code, and a small assistant chat panel

## How state works

`dashboard.html` keeps a mock account (name, balance, orders, ledger) in
`localStorage`, via the shared helpers in `js/site.js`. This means:

- Topping up, converting to bank, and the chat panel all produce real, persisted
  changes — reload the page and they're still there.
- "Reset sample data" (top right of the dashboard) restores the original mock
  account at any time.

There's no backend. Wiring this to a real one means replacing the
`window.AIG.getAccount()` / `saveAccount()` calls in `js/site.js` with real API
calls — the rest of the dashboard code doesn't need to change since it only reads
and writes through those two functions.

## Structure

```
aig-site/
├── index.html
├── marketplace.html
├── pricing.html
├── dashboard.html
├── css/style.css       design tokens + all shared styling
└── js/site.js          nav, scroll reveal, mock account state
```

## Notes on the design

- Type: Playfair Display (headlines) + Inter (body) + JetBrains Mono (figures,
  labels) — loaded from Google Fonts. If you're offline, headings fall back to
  Georgia and body text to system sans-serif; layout is unaffected either way.
- The rotating compass/seal mark in the header and hero is the one signature
  visual element — used sparingly, as a brand mark rather than decoration.
- Scroll-reveal animations are progressive enhancement only: content is visible
  by default in CSS, and a hard 2.5s fallback guarantees nothing stays hidden
  even if the animation or its trigger fails for any reason.
