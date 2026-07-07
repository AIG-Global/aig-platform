// ============================================================
// Storage — a flat JSON file, on purpose, for this EXAMPLE only.
//
// This makes the example runnable with zero external dependencies
// (no database server to install), but it has real limitations you
// should not carry into production:
//   - No concurrent-write safety — two requests writing at the exact
//     same moment can clobber each other's changes.
//   - Everything is rewritten to disk on every change — fine for a
//     handful of test subscribers, not fine for real traffic.
//   - No indexing — every lookup is a full array scan.
//
// For real use, replace the four functions below with calls to a real
// database (Postgres, SQLite via a proper driver, Redis, whatever fits
// your deployment) — keep the same function signatures and nothing in
// server.js needs to change.
// ============================================================

const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "subscriptions.json");
const USAGE_FILE = path.join(__dirname, "usage-aggregate.json");

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (e) {
    return [];
  }
}

function writeAll(subs) {
  fs.writeFileSync(DB_FILE, JSON.stringify(subs, null, 2));
}

async function upsertSubscription(sub) {
  const subs = readAll();
  const idx = subs.findIndex(s => s.endpoint === sub.endpoint);
  if (idx >= 0) subs[idx] = Object.assign({}, subs[idx], sub);
  else subs.push(sub);
  writeAll(subs);
}

async function removeSubscription(endpoint) {
  const subs = readAll().filter(s => s.endpoint !== endpoint);
  writeAll(subs);
}

async function getAllSubscriptions() {
  return readAll();
}

async function markHazardsSeen(endpoint, hazardIds) {
  const subs = readAll();
  const sub = subs.find(s => s.endpoint === endpoint);
  if (sub) {
    sub.seenHazardIds = (sub.seenHazardIds || []).concat(hazardIds).slice(-200); // cap growth
    writeAll(subs);
  }
}

async function markWeatherAlertsSeen(endpoint, alertIds) {
  const subs = readAll();
  const sub = subs.find(s => s.endpoint === endpoint);
  if (sub) {
    sub.seenWeatherAlertIds = (sub.seenWeatherAlertIds || []).concat(alertIds).slice(-100);
    writeAll(subs);
  }
}

function count() {
  return readAll().length;
}

// ============================================================
// Anonymous usage aggregate — for the "where is the app used" map.
//
// This is intentionally a SEPARATE file/table from subscriptions, with
// no shared key between them. A usage ping never carries an endpoint,
// subscription ID, or anything else that could be joined back to a
// specific subscriber. The only things ever stored here are:
//   - a rounded location (see ROUND_PRECISION below)
//   - a date bucket (day-level, not a timestamp)
//   - a count
//
// ROUNDING HAPPENS HERE, SERVER-SIDE — never trust a client to have
// rounded honestly. Precision of 1 decimal degree is roughly 11km at
// the equator (less at higher latitudes), which is coarse enough that
// a single dot represents a city-sized area, not an address.
//
// Caveat worth being direct about: this code-level anonymization
// doesn't erase incidental metadata your hosting platform may log at
// the infrastructure level (e.g. request IP addresses in a load
// balancer's access logs) — that's a hosting/ops question, outside
// what any application code can control. If that matters for your
// deployment, configure your host's access logging accordingly.
// ============================================================
const ROUND_PRECISION = 1; // decimal places

function roundCoord(n) {
  const factor = Math.pow(10, ROUND_PRECISION);
  return Math.round(n * factor) / factor;
}

function readUsage() {
  try { return JSON.parse(fs.readFileSync(USAGE_FILE, "utf8")); }
  catch (e) { return {}; }
}
function writeUsage(usage) {
  fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
}

async function recordUsagePing(lat, lon) {
  const rLat = roundCoord(lat);
  const rLon = roundCoord(lon);
  const day = new Date().toISOString().slice(0, 10);
  const key = day + "|" + rLat + "|" + rLon;

  const usage = readUsage();
  usage[key] = (usage[key] || 0) + 1;
  writeUsage(usage);
}

// Returns aggregated {lat, lon, count} points for the last N days,
// summed across days (so the map shows "activity over this window",
// not one dot per day per location).
async function getUsageAggregate(days) {
  const usage = readUsage();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (days || 30));

  const buckets = {}; // "lat|lon" -> count
  Object.entries(usage).forEach(([key, n]) => {
    const [day, lat, lon] = key.split("|");
    if (new Date(day) < cutoff) return;
    const spatialKey = lat + "|" + lon;
    buckets[spatialKey] = (buckets[spatialKey] || 0) + n;
  });

  return Object.entries(buckets).map(([spatialKey, n]) => {
    const [lat, lon] = spatialKey.split("|").map(Number);
    return { lat, lon, count: n };
  });
}

module.exports = {
  upsertSubscription, removeSubscription, getAllSubscriptions, markHazardsSeen, markWeatherAlertsSeen, count,
  recordUsagePing, getUsageAggregate
};
