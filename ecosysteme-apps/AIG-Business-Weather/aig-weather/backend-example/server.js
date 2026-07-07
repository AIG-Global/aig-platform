// ============================================================
// AIG Business Weather — background alert backend (example)
//
// What this does:
//   1. Accepts push subscriptions from the frontend (POST /api/subscribe)
//      — each one is a browser's push endpoint + a location + a radius.
//   2. Every 5 minutes, polls the same hazard sources the frontend uses
//      (USGS, GDACS, NWS) — but from the SERVER, which has no CORS
//      restriction (CORS is a browser-only concept), so no proxy is
//      needed here even though the frontend needs one.
//   3. For each subscriber, checks whether any hazard is within their
//      configured radius and hasn't already been sent to them.
//   4. Sends a real push notification via the Web Push protocol to any
//      match — this is what wakes up the Service Worker on their device
//      even if the tab isn't open.
//
// This is a genuinely complete, runnable example — not pseudocode — but
// it uses a flat JSON file as its "database" for clarity. Replace
// storage.js with a real database before running this for real users;
// see the note in that file for why.
//
// SETUP (see README.md in this folder for the full walkthrough):
//   1. npm install
//   2. npx web-push generate-vapid-keys   (do this once, save both keys)
//   3. Copy .env.example to .env, fill in your VAPID keys
//   4. npm start
//   5. Put the same VAPID public key into the frontend's app.js
//      (PUSH_CONFIG.vapidPublicKey) and set PUSH_CONFIG.backendUrl to
//      wherever you deploy this.
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const cron = require("node-cron");
const fetch = require("node-fetch");
const storage = require("./storage");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_CONTACT_EMAIL = process.env.VAPID_CONTACT_EMAIL || "mailto:admin@example.com";

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error("Missing VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY in .env — run `npx web-push generate-vapid-keys` and set them. Exiting.");
  process.exit(1);
}

webpush.setVapidDetails(VAPID_CONTACT_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// ============================================================
// Subscription endpoints
// ============================================================
app.post("/api/subscribe", async (req, res) => {
  const { subscription, location, radiusKm } = req.body || {};
  if (!subscription || !subscription.endpoint || !location || typeof location.lat !== "number" || typeof location.lon !== "number") {
    return res.status(400).json({ error: "Expected {subscription, location: {lat, lon}, radiusKm}." });
  }
  await storage.upsertSubscription({
    endpoint: subscription.endpoint,
    subscription,
    lat: location.lat,
    lon: location.lon,
    radiusKm: radiusKm || 500,
    seenHazardIds: [],
    seenWeatherAlertIds: []
  });
  res.json({ ok: true });
});

app.post("/api/unsubscribe", async (req, res) => {
  const { endpoint } = req.body || {};
  if (!endpoint) return res.status(400).json({ error: "Expected {endpoint}." });
  await storage.removeSubscription(endpoint);
  res.json({ ok: true });
});

app.get("/api/health", (req, res) => res.json({ ok: true, subscriberCount: storage.count() }));

// ============================================================
// Anonymous usage tracking — for the aggregate "where is the app used"
// map. See the big comment in storage.js for the exact anonymization
// boundary. This endpoint accepts a location and immediately rounds
// and detaches it from anything identifying before it's ever stored.
// ============================================================
app.post("/api/usage-ping", async (req, res) => {
  const { lat, lon } = req.body || {};
  if (typeof lat !== "number" || typeof lon !== "number" || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({ error: "Expected {lat, lon} as numbers in valid range." });
  }
  await storage.recordUsagePing(lat, lon);
  res.json({ ok: true });
});

// Admin-only: aggregated usage points for the dashboard map. Gated by
// a shared secret token for this example — replace with real
// authentication (proper session/user auth, not a static token) before
// using this for anything beyond a quick internal look.
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
function requireAdminToken(req, res, next) {
  if (!ADMIN_TOKEN) return res.status(503).json({ error: "ADMIN_TOKEN is not configured on the server — set it in .env." });
  const provided = req.query.token || req.headers["x-admin-token"];
  if (provided !== ADMIN_TOKEN) return res.status(401).json({ error: "Invalid or missing admin token." });
  next();
}

app.get("/api/usage-map", requireAdminToken, async (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;
  const points = await storage.getUsageAggregate(days);
  res.json({ ok: true, days, points, subscriberCount: storage.count() });
});

// ============================================================
// Hazard polling — same three sources as the frontend, but called
// server-side (no CORS concern, no proxy needed here).
// ============================================================
async function fetchUsgsEarthquakes() {
  const url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=5.0"
    + "&starttime=" + new Date(Date.now() - 24 * 3600000).toISOString();
  const res = await fetch(url);
  if (!res.ok) throw new Error("USGS HTTP " + res.status);
  const data = await res.json();
  return (data.features || []).map(f => {
    const p = f.properties;
    const [lon, lat] = f.geometry.coordinates;
    let severity = "minor";
    if (p.mag >= 7.0) severity = "extreme";
    else if (p.mag >= 6.0) severity = "severe";
    else if (p.mag >= 4.5) severity = "moderate";
    if (p.tsunami === 1 && severity !== "extreme") severity = "severe";
    return { id: "usgs-" + f.id, lat, lon, severity, title: "M" + p.mag.toFixed(1) + " — " + p.place, kind: p.tsunami === 1 ? "Earthquake (tsunami risk flagged)" : "Earthquake" };
  });
}

async function fetchGdacsEvents() {
  const url = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=EQ;TC;FL;VO;WF&alertlevel=orange;red";
  const res = await fetch(url);
  if (!res.ok) throw new Error("GDACS HTTP " + res.status);
  const data = await res.json();
  const typeLabels = { EQ: "Earthquake", TC: "Tropical cyclone", FL: "Flood", VO: "Volcanic activity", WF: "Wildfire" };
  return (data.features || []).map(f => {
    const p = f.properties || {};
    let lat = null, lon = null;
    if (f.geometry && f.geometry.type === "Point") [lon, lat] = f.geometry.coordinates;
    if (lat == null) return null;
    const alertLevel = (p.alertlevel || "").toLowerCase();
    const severity = alertLevel === "red" ? "extreme" : "severe";
    const eventType = p.eventtype || "??";
    return { id: "gdacs-" + (p.eventid || f.id), lat, lon, severity, title: p.name || (typeLabels[eventType] || eventType), kind: typeLabels[eventType] || eventType };
  }).filter(Boolean);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Same rule as the frontend's isBigWarningWorthy() in app.js: extreme
// severity always qualifies; severe severity qualifies only for these
// specific high-impact types. Kept in sync deliberately, in both
// wording and behavior — if a hazard matches, the push notification
// should be just as hard to miss as the foreground modal, not a normal
// dismissible one. If you change the keyword list or the severity rule
// in one file, change it in the other too.
const BIG_WARNING_KEYWORDS = /tornado|typhoon|hurricane|cyclone|flood|severe thunderstorm|earthquake|tsunami/i;
function isBigWarningWorthy(h) {
  if (h.severity === "extreme") return true;
  if (h.severity === "severe" && BIG_WARNING_KEYWORDS.test((h.kind || "") + " " + (h.title || ""))) return true;
  return false;
}

// ============================================================
// Conversational weather alerts ("bring an umbrella") — server-side
// port of the exact same logic in the frontend's app.js
// (generateWeatherAlerts / WEATHER_ALERT_THRESHOLDS). Kept in sync
// deliberately: if you change the thresholds or phrasing in one place,
// change them in the other too, or foreground and background alerts
// will disagree with each other.
// ============================================================
const WEATHER_ALERT_THRESHOLDS = {
  lookaheadHours: 12,
  rainProbability: 60,
  snowWeatherCodes: [71, 73, 75, 85, 86],
  freezingRainCodes: [66, 67],
  strongWindKmh: 40,
  strongGustKmh: 55,
  hotC: 32,
  coldC: 0
};

async function fetchHourlyForecast(lat, lon) {
  const url = "https://api.open-meteo.com/v1/forecast"
    + "?latitude=" + lat + "&longitude=" + lon
    + "&current=temperature_2m,weather_code"
    + "&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_gusts_10m"
    + "&timezone=auto&forecast_days=2";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Open-Meteo HTTP " + res.status);
  return res.json();
}

function formatHourLabel(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function generateWeatherAlerts(data) {
  const hourly = data.hourly;
  const now = new Date(data.current.time);
  const nowIdx = Math.max(0, hourly.time.findIndex(t => new Date(t) >= now));
  const endIdx = Math.min(hourly.time.length, nowIdx + WEATHER_ALERT_THRESHOLDS.lookaheadHours);
  const today = now.toISOString().slice(0, 10);
  const alerts = [];

  function addOnceForToday(kind, idx, build) {
    const id = "wx-" + kind + "-" + today;
    if (alerts.some(a => a.id === id)) return;
    alerts.push(Object.assign({ id }, build()));
  }

  for (let i = nowIdx; i < endIdx; i++) {
    const code = hourly.weather_code[i];
    const timeLabel = formatHourLabel(new Date(hourly.time[i]));

    if (hourly.precipitation_probability[i] >= WEATHER_ALERT_THRESHOLDS.rainProbability
        && !WEATHER_ALERT_THRESHOLDS.snowWeatherCodes.includes(code)
        && !WEATHER_ALERT_THRESHOLDS.freezingRainCodes.includes(code)) {
      addOnceForToday("rain", i, () => ({ title: "Rain expected", body: "Bring an umbrella — rain is expected around " + timeLabel + " (" + hourly.precipitation_probability[i] + "% chance)." }));
    }
    if (WEATHER_ALERT_THRESHOLDS.snowWeatherCodes.includes(code)) {
      addOnceForToday("snow", i, () => ({ title: "Snow expected", body: "Snow is expected around " + timeLabel + " — allow extra time if you're driving." }));
    }
    if (WEATHER_ALERT_THRESHOLDS.freezingRainCodes.includes(code)) {
      addOnceForToday("ice", i, () => ({ title: "Freezing rain expected", body: "Freezing rain is expected around " + timeLabel + " — watch for ice on roads and walkways." }));
    }
    if (hourly.wind_gusts_10m && hourly.wind_gusts_10m[i] >= WEATHER_ALERT_THRESHOLDS.strongGustKmh) {
      addOnceForToday("wind", i, () => ({ title: "Strong wind gusts expected", body: "Wind gusts up to " + Math.round(hourly.wind_gusts_10m[i]) + " km/h expected around " + timeLabel + " — secure anything loose outside." }));
    } else if (hourly.wind_speed_10m[i] >= WEATHER_ALERT_THRESHOLDS.strongWindKmh) {
      addOnceForToday("wind", i, () => ({ title: "Strong wind expected", body: "Sustained winds around " + Math.round(hourly.wind_speed_10m[i]) + " km/h expected around " + timeLabel + "." }));
    }
    if (hourly.temperature_2m[i] >= WEATHER_ALERT_THRESHOLDS.hotC) {
      addOnceForToday("heat", i, () => ({ title: "High heat expected", body: "It'll reach " + Math.round(hourly.temperature_2m[i]) + "°C around " + timeLabel + " — stay hydrated." }));
    }
    if (hourly.temperature_2m[i] <= WEATHER_ALERT_THRESHOLDS.coldC) {
      addOnceForToday("cold", i, () => ({ title: "Freezing temperatures expected", body: "Temperatures drop to " + Math.round(hourly.temperature_2m[i]) + "°C around " + timeLabel + " — dress warmly." }));
    }
  }
  return alerts;
}

async function runWeatherAlertCheck() {
  const subscribers = await storage.getAllSubscriptions();
  console.log("[" + new Date().toISOString() + "] Checking weather alerts for", subscribers.length, "subscribers...");

  for (const sub of subscribers) {
    let alerts;
    try {
      const forecast = await fetchHourlyForecast(sub.lat, sub.lon);
      alerts = generateWeatherAlerts(forecast);
    } catch (err) {
      console.error("Weather fetch failed for", sub.endpoint.slice(0, 60) + "...", err.message);
      continue; // one subscriber's forecast failing never blocks the others
    }

    const seen = sub.seenWeatherAlertIds || [];
    const newAlerts = alerts.filter(a => !seen.includes(a.id));
    if (!newAlerts.length) continue;

    for (const alert of newAlerts) {
      const payload = JSON.stringify({
        title: "AIG Business Weather — " + alert.title,
        body: alert.body,
        tag: alert.id,
        severity: "info",
        url: "/"
      });
      try {
        await webpush.sendNotification(sub.subscription, payload);
        console.log("Sent weather alert to", sub.endpoint.slice(0, 60) + "...", "for", alert.id);
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await storage.removeSubscription(sub.endpoint);
          console.log("Removed dead subscription:", sub.endpoint.slice(0, 60) + "...");
          break; // no point sending more to a dead subscription
        } else {
          console.error("Weather push failed for", sub.endpoint.slice(0, 60) + "...", err.message);
        }
      }
    }
    await storage.markWeatherAlertsSeen(sub.endpoint, newAlerts.map(a => a.id));
  }
}

// ============================================================
// The actual hazard matching + sending job
// ============================================================
async function runHazardCheck() {
  console.log("[" + new Date().toISOString() + "] Checking hazards for", storage.count(), "subscribers...");

  const results = await Promise.allSettled([fetchUsgsEarthquakes(), fetchGdacsEvents()]);
  let hazards = [];
  results.forEach(r => { if (r.status === "fulfilled") hazards = hazards.concat(r.value); });
  // Only alert on severe/extreme in the background job — same threshold
  // the frontend uses for foreground toasts, kept consistent deliberately.
  hazards = hazards.filter(h => h.severity === "severe" || h.severity === "extreme");

  if (!hazards.length) { console.log("No severe/extreme hazards this cycle."); return; }

  const subscribers = await storage.getAllSubscriptions();
  for (const sub of subscribers) {
    const newMatches = hazards.filter(h => {
      if (sub.seenHazardIds.includes(h.id)) return false;
      const distance = haversineKm(sub.lat, sub.lon, h.lat, h.lon);
      return distance <= sub.radiusKm;
    });

    for (const hazard of newMatches) {
      const bigWarning = isBigWarningWorthy(hazard);
      const payload = JSON.stringify({
        title: (bigWarning ? "\u26a0\ufe0f SEVERE WEATHER WARNING! — " : "AIG Business Weather — ") + hazard.kind,
        body: hazard.title,
        tag: hazard.id,
        severity: hazard.severity,
        isBigWarning: bigWarning,
        url: "/"
      });
      try {
        await webpush.sendNotification(sub.subscription, payload);
        console.log("Sent alert to", sub.endpoint.slice(0, 60) + "...", "for", hazard.id);
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription is dead (browser data cleared, uninstalled, etc.) — clean it up.
          await storage.removeSubscription(sub.endpoint);
          console.log("Removed dead subscription:", sub.endpoint.slice(0, 60) + "...");
        } else {
          console.error("Push failed for", sub.endpoint.slice(0, 60) + "...", err.message);
        }
      }
    }

    if (newMatches.length) {
      await storage.markHazardsSeen(sub.endpoint, newMatches.map(h => h.id));
    }
  }
}

// Run every 5 minutes — matches the frontend's own auto-refresh cadence,
// though these are independent (one is the browser tab checking while
// open, this is the backend checking regardless of whether any tab is open).
cron.schedule("*/5 * * * *", () => {
  runHazardCheck().catch(err => console.error("Hazard check cycle failed:", err));
});

// Weather alerts run on a SEPARATE, less frequent schedule (every 30
// minutes) deliberately: unlike the hazard check (one API call total,
// checked against every subscriber), the weather check makes ONE
// Open-Meteo call PER SUBSCRIBER, since each person's forecast is
// specific to their own location. At 5-minute intervals with a
// meaningful number of subscribers, that adds up fast against
// Open-Meteo's free-tier limit (~10,000 calls/day) — and "rain at 2pm"
// doesn't need re-checking every 5 minutes anyway, since forecasts for
// a few hours out don't meaningfully change that often.
cron.schedule("*/30 * * * *", () => {
  runWeatherAlertCheck().catch(err => console.error("Weather alert check cycle failed:", err));
});

app.listen(PORT, () => {
  console.log("AIG Business Weather backend listening on port " + PORT);
  console.log("Running an initial hazard check now, then every 5 minutes...");
  runHazardCheck().catch(err => console.error("Initial hazard check failed:", err));
  console.log("Running an initial weather alert check now, then every 30 minutes...");
  runWeatherAlertCheck().catch(err => console.error("Initial weather alert check failed:", err));
});
