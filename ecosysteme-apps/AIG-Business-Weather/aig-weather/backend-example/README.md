# AIG Business Weather — background alert backend (example)

A real, runnable Node.js backend that makes true background push alerts
possible — notifications that arrive even when the AIG Business Weather
tab isn't open, as long as the subscriber's browser is running.

**Honesty check on what "runnable" means here:** I wrote and syntax-checked
this code carefully, and the logic (subscription storage, hazard
matching, Web Push sending) is real and complete — not pseudocode. What
I could **not** do is actually install its dependencies or run it,
because this sandbox has no npm registry access. Test this yourself
before relying on it; treat it as a strong, complete starting point that
hasn't been execution-tested, not as something guaranteed bug-free.

## What this does

1. Accepts push subscriptions from the frontend (`POST /api/subscribe`)
   — each one is a browser's push endpoint, a location, and an alert radius.
2. Every 5 minutes, polls USGS and GDACS directly (server-to-server has
   no CORS restriction — that's a browser-only concept — so no proxy is
   needed here, unlike the frontend).
3. For each subscriber, checks whether any severe/extreme hazard is
   within their radius and hasn't already been sent to them.
4. Sends a real Web Push notification for any match, which wakes up the
   Service Worker (`sw.js`, in the parent folder) on the subscriber's
   device.

**Kept consistent with the foreground app on purpose**: the frontend's
big red "SEVERE WEATHER WARNING!" modal (see the main README) appears
for extreme-severity hazards of any type, or severe-severity hazards
matching specific high-impact types (tornado, typhoon/cyclone,
earthquake, flood, severe thunderstorm). This backend applies the exact
same rule (`isBigWarningWorthy()` in `server.js`, deliberately mirroring
`app.js`'s version — verified to produce identical decisions against the
same test cases) before sending a push, and sets `isBigWarning: true` in
the payload. `sw.js` uses that flag for `requireInteraction` (the
notification stays on screen until dismissed, rather than
auto-disappearing) and a vibration pattern on supporting devices — so
the same tornado/typhoon/earthquake/flood warning is just as hard to
miss whether it arrived as a foreground toast or a background push. If
you change the keyword list or severity rule in one file, change it in
the other too, or the two experiences will drift apart.

## Setup

```bash
cd backend-example
npm install
npx web-push generate-vapid-keys
```

That last command prints a public and private key pair. Copy
`.env.example` to `.env` and paste them in:

```
VAPID_PUBLIC_KEY=<the public key it printed>
VAPID_PRIVATE_KEY=<the private key it printed>
VAPID_CONTACT_EMAIL=mailto:you@example.com
```

Then:

```bash
npm start
```

You should see it log that it's listening, then run an initial hazard
check.

## Connecting the frontend to this backend

In the main app's `app.js`, find `PUSH_CONFIG` near the top and fill in:

```js
const PUSH_CONFIG = {
  backendUrl: "https://wherever-you-deployed-this.example.com/api/subscribe",
  vapidPublicKey: "<the same public key from your .env>"
};
```

That's the only change needed for push alerts — the "Subscribe" button
in Settings goes from disabled to live automatically once both values
are set.

For the anonymous usage map (see below), also fill in `USAGE_PING_CONFIG`
in the same file:

```js
const USAGE_PING_CONFIG = {
  backendBaseUrl: "https://wherever-you-deployed-this.example.com"
};
```

## Anonymous usage map

`admin-dashboard.html` is a standalone page (open it directly, or serve
it however you like — it's just a static file) that shows **aggregate**
usage as dots on a world map: where the app is being used in general,
never who specifically.

**The privacy boundary, and how it's enforced — not just promised:**

- The frontend's usage ping (`POST /api/usage-ping`) sends only
  `{lat, lon}` — no endpoint, no subscription ID, nothing that
  identifies a person or device.
- The backend rounds that location to 1 decimal degree (~11 km) and
  discards the precise value **before it's ever written to disk** —
  see the `recordUsagePing` function and the large comment above it in
  `storage.js`.
- Usage data lives in a completely separate store
  (`usage-aggregate.json`) from subscriptions (`subscriptions.json`),
  with no shared key between them — there is no query that joins the
  two, because there's no field they have in common.
- I verified this directly with unit tests against the actual storage
  code (not just by reading it): two nearby pings correctly collapse
  into the same rounded bucket, the precise original coordinates never
  appear anywhere in the stored file, and there's no "endpoint" field
  anywhere in the usage table.

**What this doesn't and can't cover:** infrastructure-level logging
(e.g. your host's load balancer logging request IPs) happens outside
any application code's control. If that matters for your deployment,
configure your hosting platform's access-log retention accordingly —
this is a hosting/ops decision, not something `storage.js` or
`server.js` can enforce.

**Protecting the dashboard itself:** `/api/usage-map` requires an
`ADMIN_TOKEN` (set in `.env`, generate with `openssl rand -hex 32`). This
is a shared-secret stand-in for real authentication — fine for one admin
checking a dashboard themselves, not a substitute for real
session/user-based auth if more than one person needs access.

**Map rendering uses Leaflet + OpenStreetMap tiles** (loaded from
`unpkg.com` and `tile.openstreetmap.org`), both free with no API key. If
those are blocked by an ad-blocker, a corporate firewall, or you're
offline, the dashboard degrades gracefully — the stats (subscriber
count, distinct locations, total pings) still load and display, with a
specific note explaining the map itself couldn't render, rather than
the whole dashboard failing. I confirmed this exact degradation path
directly: the sandbox this was built in also couldn't reach `unpkg.com`,
which is what surfaced the need for that fallback in the first place —
so the "map blocked, stats fine" path is real-tested, even though I
couldn't personally see the actual rendered map with real network access.

## Deploying this for real

`npm start` runs it locally, but background alerts only work while this
process keeps running continuously — that means real hosting, not your
laptop. Reasonable options:

- **A small always-on VPS** (DigitalOcean, Linode, a $5-6/month droplet
  is plenty for a modest number of subscribers) running this with
  `pm2` or a systemd service so it restarts if it crashes.
- **Railway, Render, or Fly.io** — platforms that keep a small Node
  process running continuously for a low monthly cost, less setup than a
  raw VPS.
- Serverless (Vercel/Cloudflare Workers/AWS Lambda) **doesn't fit this
  particular design** as-is, since `node-cron` needs a process that's
  always alive to tick every 5 minutes — you'd need to swap the cron
  logic for a scheduled trigger (Vercel Cron, Cloudflare Cron Triggers,
  EventBridge) calling an endpoint instead. Doable, but a real
  restructuring, not a config change.

Whatever you choose, this needs to run over **HTTPS** with a real
domain — Service Workers and the Push API both refuse to work over a
plain HTTP connection (except `localhost`, for local testing only).

## Replacing the storage

`storage.js` uses a flat JSON file on purpose, so this example needs
zero external services to try. Read the comment at the top of that file
— it's not safe for concurrent writes or real traffic. Swap in a real
database before this serves actual users; the four exported functions
(`upsertSubscription`, `removeSubscription`, `getAllSubscriptions`,
`markHazardsSeen`) are the only surface `server.js` touches, so that's
the entire integration point.

## Files

```
server.js               Express app, hazard polling, push-sending logic,
                          usage-ping + usage-map endpoints
storage.js               subscription storage AND the separate anonymous
                          usage-aggregate store — swap both for a real DB
admin-dashboard.html      standalone usage-map dashboard (Leaflet + OSM)
package.json              dependencies
.env.example               copy to .env and fill in VAPID keys + ADMIN_TOKEN
subscriptions.json         created automatically on first subscribe (git-ignored)
usage-aggregate.json       created automatically on first usage ping (git-ignored)
```
