# AIG Business Weather

Forecasts and hazard warnings, kept clearly separate, with GPS-based
location and immediate in-app/browser alerts while this page is open.
Built on real public data sources — no scraping, no fabricated feeds.

**This supplements, it does not replace, official emergency alerts.**
That's stated in the app itself, not just here. Always follow your local
authorities, Wireless Emergency Alerts, NOAA Weather Radio, or your
country's equivalent official channel.

## Run it

No build step for the main app. From this folder:
```
python3 -m http.server 8000
```
Then open `http://localhost:8000`. (Same `file://` CORS restriction as
the other AIG apps — must be served over HTTP; geolocation additionally
requires either `localhost` or a real HTTPS origin in most browsers.)

## Data sources — real, verified, and honestly scoped

| Data | Source | Access |
|---|---|---|
| Regular weather (current, hourly, 7-day) | [Open-Meteo](https://open-meteo.com) | Direct fetch — no key, documented CORS support |
| Earthquakes | [USGS Earthquake Hazards Program](https://earthquake.usgs.gov) | Direct fetch — no key, documented-permissive CORS |
| Cyclones, floods, volcanoes, wildfires | [GDACS](https://www.gdacs.org) (UN/EU Joint Research Centre) | Via CORS proxy — no documented CORS support |
| Severe weather alerts | [NOAA/NWS](https://www.weather.gov) — **US locations only** | Via CORS proxy — **confirmed** `api.weather.gov` does not reliably send CORS headers (multiple real developer reports of exactly this failure) |

**Tsunami specifically**: there's no clean, CORS-confirmed public API from
PTWC/tsunami.gov that this app pulls directly. Instead, it surfaces
USGS's own `tsunami` flag — set on earthquakes that meet regional
tsunami-warning notification criteria (roughly M≥7, shallow, offshore).
That's a real, accurate signal, but it's not the same as an official
tsunami bulletin — the app links to tsunami.gov directly for that.

**On GDACS's exact field names**: GDACS's own documentation confirms the
endpoint and general response shape (GeoJSON, with properties like
`eventtype`/`alertlevel`/`country`/`name`/`description`) but a
byte-for-byte schema wasn't available while building this. The parsing
code is written defensively — it tries reasonable property-name
variants and skips fields it doesn't recognize rather than crashing the
whole feed. If GDACS's real response differs from what's coded, hazard
cards from that source specifically may show incomplete info rather than
failing outright; the other two sources are unaffected either way.

## Conversational weather alerts ("bring an umbrella")

Separate from hazard warnings — these are everyday forecast heads-ups,
generated from the same Open-Meteo hourly data already being fetched
(no extra data source). They're visually and behaviorally distinct from
hazard warnings on purpose: blue, not red, since "it might rain at 2pm"
and "a tsunami-risk earthquake was just detected nearby" are very
different kinds of things and shouldn't look or feel the same.

Currently covers: rain (≥60% chance), snow, freezing rain, strong wind
(sustained ≥40 km/h or gusts ≥55 km/h), high heat (≥32°C), and freezing
temperatures (≤0°C) — see `WEATHER_ALERT_THRESHOLDS` in `app.js` to
adjust any of these. Each condition is reported once per day, at the
first hour (within the next 12 hours) it's forecast to occur — not
repeated every hour it remains true.

These appear in their own "Weather heads-up" panel (persistent, so you
don't need to catch the toast to see them) and as a foreground toast +
optional browser notification, same mechanism as hazard alerts. The
background/push version of these same alerts is in `backend-example/`
— see its README.

## Big "SEVERE WEATHER WARNING!" modal

For the specific high-impact hazard types — typhoon/cyclone, tornado,
earthquake, flood, severe thunderstorm — plus anything rated "extreme"
regardless of type, a much more prominent full-screen red warning modal
appears instead of the normal toast: a large red square with an
exclamation mark, "SEVERE WEATHER WARNING!" in bold, the specific hazard
details, and a big dismiss button. Vibrates on supporting mobile devices
as an additional physical cue. Multiple simultaneous warnings queue one
at a time rather than stacking into an unreadable pile — dismissing one
shows the next automatically.

Anything merely "severe" that doesn't match those specific high-impact
types (e.g., a moderate wildfire alert) keeps using the smaller, less
intrusive toast, same as before — the goal is that the big modal stays
meaningful precisely because it's reserved for genuinely major events,
not diluted by lower-stakes warnings.

## Graphical, condition-matched forecast display

The current-conditions panel's background and decorative animation
change with the actual forecast: rain streaks falling for rain, drifting
snowflakes for snow, lightning flashes for thunderstorms, a warm glow for
clear skies, soft drifting clouds for overcast — all pure CSS/DOM
animation, no images. The hourly forecast strip shows a small graphical
bar per hour (not just the number) reflecting rain probability at a
glance. "Feels like" temperature is now a distinct, prominent line, and
when there's a meaningful gap (≥3°) between actual and feels-like, a note
explains why ("likely wind chill" / "likely humidity").

## Two kinds of alerts, and what each actually requires

**Foreground (works today, fully tested):** while this tab is open, the
app checks all three hazard sources, shows an in-app toast for any new
severe/extreme hazard within your alert radius, and — if you grant
permission — a browser Notification too. Auto-refreshes every 5 minutes.

**Background (needs a backend you deploy — real, complete code included):**
a real alert that arrives even if this tab is closed requires a Service
Worker (`sw.js`, included), a push subscription flow (built into
`app.js`, gated behind `PUSH_CONFIG`), and a backend that's always
running to poll hazards and send the actual push messages. See
`backend-example/` for that backend and its own README for deployment.
Until you configure `PUSH_CONFIG`, the "Subscribe" button in Settings
stays honestly disabled with an explanation, rather than pretending to
work.

iOS note: Safari only supports web push from 16.4+ (2023), and only if
the site has been "installed" to the home screen first — this is a
platform limitation, not something this app's code can work around.

## Anonymous usage map (admin-facing)

If you deploy the backend and set `USAGE_PING_CONFIG.backendBaseUrl` in
`app.js`, setting a location also sends a one-time, anonymous usage ping
so an admin can see **aggregate** usage on a map —
`backend-example/admin-dashboard.html`. This is disclosed directly in
the app's location banner, not hidden in documentation only.

This is deliberately scoped to aggregate-only: the ping carries nothing
but `{lat, lon}`, the backend rounds it to ~11km and discards the precise
value before storing anything, and the usage table has no shared key
with the subscriber table — there's no way to click a dot and see who it
was, because that information is never retained in the first place. See
`backend-example/README.md` for the full detail on how that boundary is
enforced in the actual storage code (verified with unit tests, not just
asserted), not just how it's supposed to work.

## Tested

- Manual location entry (with coordinate validation) and the GPS flow's
  error states (permission denied, timeout, no geolocation support)
- Weather rendering: current conditions, 24-hour strip, 7-day strip
- All three hazard sources rendering correctly together, sorted by
  severity (extreme → severe → moderate → minor)
- Severity mapping: earthquake magnitude bins, the tsunami-flag escalation
  and explanatory note, GDACS alert-level mapping, NWS's own severity field
- Distance calculation (haversine) shown per hazard
- **Partial hazard-source failure**: simulated USGS going down entirely
  — confirmed the other two sources still render correctly and the
  status indicator reports "2 of 3 sources live" rather than failing
  everything or failing silently
- US-location detection correctly includes NWS; non-US locations
  correctly skip it (confirmed both paths)
- Foreground alerting: toast + notification fire for new severe/extreme
  hazards only (not moderate/minor), don't re-fire for already-seen
  hazards on refresh, dismiss correctly
- Settings: radius slider, save, auto-refresh toggle
- The background-alert "Subscribe" button's disabled/honest state when
  no backend is configured (today's actual state)
- Mobile (390px touch viewport) — no horizontal overflow, forecast
  strips scroll correctly, settings modal fits
- **Anonymous usage ping**: confirmed via the real `app.js` code path
  (not a hand-simulated version) that it does NOT fire with no backend
  configured (today's default), and fires with exactly `{lat, lon}` —
  nothing else — once `USAGE_PING_CONFIG` is set
- **Usage-map anonymization boundary**: unit-tested the backend's
  storage logic directly — nearby pings collapse into the same rounded
  bucket, precise coordinates never appear in the stored file, no
  subscription/endpoint reference anywhere in the usage table, and
  date-window filtering (7/30/90 days) works correctly
- **Admin dashboard**: wrong-token rejection, correct-token connect,
  stats display, config persistence across reload, disconnect clearing
  stored config — plus a real bug I found and fixed: a map-library
  loading failure (blocked CDN) was incorrectly treated the same as a
  backend-connection failure, reverting the whole dashboard to the
  connect screen even when the data had already loaded successfully.
  Fixed so stats always display once fetched, independent of whether
  the map itself can render.
- **Conversational weather alerts**: all six alert types (rain, snow,
  freezing rain, wind, heat, cold) triggering correctly at the right
  forecast hour with correct phrasing; same-day dedup (a 3-hour rain
  stretch produces exactly one alert, not three); toast/panel/browser-
  notification all firing correctly; server-side alert-generation logic
  verified to produce byte-for-byte identical output to the frontend
  version against the same input data.
- **Two real bugs found and fixed during this specific round of
  testing:**
  1. A freezing-rain hour (weather code 66/67) also satisfied the
     generic "rain expected" check, producing a redundant and
     somewhat contradictory pair of alerts ("bring an umbrella" +
     "watch for ice") for the same hour. Fixed by excluding
     freezing-rain codes from the generic rain check, the same way
     snow codes already were.
  2. A more serious one: the alert toast stack was positioned with a
     fixed `top: 20px`, which — confirmed via real click-actionability
     testing, not just visual inspection — directly overlapped the
     topbar's refresh/settings buttons. For as long as any toast was
     showing, clicking those buttons would silently hit the toast
     instead of the button underneath. Fixed by dynamically positioning
     the toast stack just below the topbar's actual rendered height
     (which itself varies — the topbar wraps to multiple lines on
     narrow screens), recalculated on resize and before every toast.
- **Severe warning modal**: extreme-severity hazards of any type
  trigger it; severe-severity hazards trigger it only when they match
  the named high-impact types (tornado, typhoon/cyclone, earthquake,
  flood, severe thunderstorm); a severe hazard that doesn't match
  (e.g. a wildfire) correctly stays on the smaller toast instead.
  Multiple simultaneous warnings queue and display one at a time.
  Tested specifically on a 390px mobile viewport: modal fits with no
  horizontal overflow, dismiss button meets the 44px+ touch-target
  minimum (found it at 42px initially, fixed to 48px).
- **Graphical weather theming**: all six condition themes (clear,
  cloudy, fog, rain, snow, storm) apply the correct background and
  correct count of decorative animated elements; the "feels like" note
  fires correctly in both directions (colder → wind chill, warmer →
  humidity) exactly at the ≥3° threshold and correctly stays silent
  for a negligible gap; hourly rain-probability bars scale to the
  correct height; all of the above re-verified on mobile with the
  actual rendered screenshots, not just element counts.
- **Foreground/background severity consistency**: found that the
  service worker only escalated `requireInteraction` for
  extreme-severity pushes, while the foreground modal also escalates
  for severe-severity hazards matching the named high-impact types
  (tornado, typhoon, earthquake, flood, severe thunderstorm) — meaning
  the same warning would be genuinely hard to miss with the tab open
  but just a normal dismissible notification via push. Fixed by porting
  the exact same matching rule to the backend and threading an
  `isBigWarning` flag through the push payload into `sw.js`. Verified
  the client and server copies of this rule produce identical decisions
  against seven test cases spanning every combination (extreme of any
  type, severe matching each named type, severe not matching, moderate).

**Not tested, and I want to be direct about why:** the actual backend
(`backend-example/`) couldn't be run in the sandbox this was built in —
no npm registry access, no way to generate real VAPID keys or send a
real push message end to end. The code is real and was checked
carefully (syntax, logic, correct use of the `web-push`/`node-cron`/
`express` APIs based on their documented interfaces), but "written
correctly" and "verified running" are different claims — test it
yourself before depending on it.

## Files

```
index.html            structure, styling, layout
app.js                 location, weather, all three hazard fetches,
                        severity mapping, foreground alerting, settings,
                        the push-subscription client flow (gated off
                        until PUSH_CONFIG is filled in)
sw.js                   Service Worker — handles incoming push events
                        and notification clicks; does nothing without
                        a real backend sending pushes
backend-example/        a complete, real (but execution-untested) Node.js
                        backend for background alerts — see its own README
```
