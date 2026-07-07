# AIG HELO — emergency numbers & embassy finder

A GPS-based "help button": detects what country you're in, shows the
right local emergency numbers as big tap-to-call buttons, and links to
your home country's official embassy locator. No account, no backend —
runs entirely in the browser.

**This supplements, never replaces, calling local emergency services
directly.** That's stated in the app itself, not just here.

## Run it

No build step. From this folder:
```
python3 -m http.server 8000
```
Then open `http://localhost:8000`. (Same `file://` CORS restriction as
the other AIG apps — must be served over HTTP; geolocation additionally
requires `localhost` or a real HTTPS origin in most browsers.)

## How location detection works

1. Browser Geolocation API gets GPS coordinates.
2. Those coordinates go to BigDataCloud's free, keyless, client-side
   reverse-geocoding endpoint
   (`api.bigdatacloud.net/data/reverse-geocode-client`) — built
   specifically for direct browser calls, no API key, no CORS proxy
   needed, no sign-up.
3. The returned country code looks up that country's curated emergency
   numbers.

If GPS is denied, times out, or the browser doesn't support it, the app
falls back to your last known country (cached locally) with a clear
notice, and always offers "Set country manually" as a direct next step
— it never just fails silently.

## On data honesty — read this before trusting it blindly

**Emergency numbers** (`data.js`, `EMERGENCY_NUMBERS`): a curated list
now covering 71 countries, including full Eastern Europe / former
Eastern Bloc coverage (Poland, Czech Republic, Hungary, Romania,
Bulgaria, Slovakia, Belarus, Moldova, the Baltic states, Ukraine,
Russia, and the ex-Yugoslav states — Bosnia and Herzegovina, Montenegro,
North Macedonia, Serbia, Croatia, Albania) plus the Middle East/Southeast
Asia block specifically requested (UAE, Thailand, Philippines, Vietnam).
Built from general knowledge — **not** independently verified against
each country's current official telecom regulator. Emergency numbers do
occasionally change. Every response in the app also links to a
continuously-updated public reference (Wikipedia's "List of emergency
telephone numbers") specifically so a traveler can double-check rather
than rely on a single source, including for the countries not in the
curated list, which show that reference link directly instead of a
fabricated guess.

**Belarus is a deliberate edge case worth knowing about**: unlike most
countries, its 112 line reaches fire services only — not police or
ambulance, which have separate direct numbers (102 / 103 / 101). It has
no single "general" number, so the app shows all three as equal-weight
buttons rather than picking a misleading "primary" one, with a note
explaining the 112 caveat. Confirmed this renders correctly rather than
crashing or looking broken with no primary button.

**Embassy finders** (`data.js`, `EMBASSY_FINDERS`): deliberately NOT a
static database of embassy addresses. Addresses go stale — embassies
move, close, merge. Instead, this links to each home country's own
official embassy/consular locator tool (currently ~24 countries have a
direct link). For any home country not covered, the app builds a plain
web-search link ("Pakistan embassy in Thailand") instead of showing
nothing — honest and always works, even though it's a worse experience
than a direct official link.

**If you have real embassy or emergency-number data you want loaded
in** (e.g. from an official government feed), `data.js` is a single,
clearly-structured file — extending either list is a matter of adding
entries in the same shape, not restructuring anything.

## Nationality onboarding

On first visit, the app asks for your nationality up front — "so your
embassy is ready before you need it" — because for a business traveler,
knowing your own embassy is reachable wherever you land is part of
feeling safe, not an afterthought buried in a settings menu.

**This never blocks the actual emergency numbers.** The onboarding is a
modal overlay; police/ambulance/fire detection and display run
independently underneath it and work identically whether you answer the
prompt or tap "Skip for now — I need emergency numbers right away."
Someone opening this app already in a stressful situation gets the
number immediately, not a setup flow standing in the way. Once set, your
nationality persists (localStorage) and the embassy link appears
automatically as soon as both your nationality and current location are
known — no need to re-select it each time you open the app.

## Tested

- GPS success → reverse geocode → correct country and correct
  emergency-number buttons with correct `tel:` links (verified against
  Thailand's general/tourist-police/ambulance numbers and Germany's
  general/police split)
- GPS denied/unavailable → falls back to cached last-known country with
  a clear notice, or to "location unavailable" with a direct manual-entry
  prompt if there's no cache
- Manual country override, including a country intentionally NOT in the
  curated list (confirmed the honest fallback message + reference link,
  not a guessed number)
- Share-location: copies the exact correct Google Maps link for the
  actual GPS coordinates to the clipboard, with a fallback if the
  Clipboard API itself is unavailable
- Embassy finder: both the direct-official-link path (tested with US)
  and the search-fallback path (tested with Pakistan, not in the direct
  list) — confirmed the fallback builds the correct, readable search query
- Home country selection persists across page reload
- Mobile (390px touch viewport) — no horizontal overflow; emergency
  buttons measured at 354×73px, comfortably large tap targets for a
  stress situation, not just meeting a minimum
- **Nationality onboarding**: shows on first visit, confirmed the
  emergency numbers render and work identically while the modal is still
  open (never blocked); "Continue" without a selection correctly refuses
  to close; selecting + continuing persists across reload and does not
  re-show the modal; "Skip for now" closes without setting anything and
  emergency numbers keep working; "Change" reopens the modal pre-filled
  with the current selection.
- **Country coverage verification**: tested every requested country
  directly — UAE, Thailand, Philippines, Vietnam, Russia, and the full
  Eastern Bloc addition (Poland, Bulgaria, Slovakia, Belarus, Moldova,
  Estonia, Latvia, Lithuania, Bosnia and Herzegovina, Montenegro, North
  Macedonia, Serbia, Albania, Ukraine) — confirmed each renders the
  correct numbers with correct `tel:` links, sourced from Wikipedia's
  "List of emergency telephone numbers" and the EU's official emergency-
  number reference rather than guessed. Re-verified the Belarus edge
  case (no general number, all three services on separate lines)
  specifically on mobile — renders all three as equal-weight buttons
  with no overflow and no crash from the missing "primary" button.
- **Found and fixed a real placement bug**: a country's explanatory note
  (e.g. UK's "112 also works and reaches the same services") was
  attached to whichever button happened to be flagged "primary" — for
  the UK this meant the note about the SECONDARY 112 number rendered
  underneath the PRIMARY 999 button instead, reading confusingly. Worse,
  for a country with no single "general" number (Japan: separate
  police/ambulance/fire lines), there was no primary button for the note
  to attach to at all, so Japan's genuinely useful note ("119 covers
  both fire and ambulance") silently never appeared anywhere. Fixed by
  rendering each country's note once, below the whole button group,
  rather than tied to any individual button — confirmed both cases
  directly: UK's note now reads correctly, and Japan's previously-missing
  note now renders.

## Files

```
index.html    structure, styling, layout — mobile-first, high-contrast,
               large tap targets throughout since this is fundamentally
               a "need this fast, possibly stressed" tool
data.js        curated emergency numbers + embassy-finder links +
               the fallback reference URL and search-link builder
countries.js   a broad ISO country name/code list for the dropdowns —
               stable reference data, much lower staleness risk than
               addresses or phone numbers
app.js         geolocation, reverse geocoding, all rendering and actions
```
