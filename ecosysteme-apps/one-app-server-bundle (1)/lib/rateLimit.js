// ============================================================
// lib/rateLimit.js — Minimal in-memory rate limiter.
//
// No external dependency (no express-rate-limit). Sliding-window
// counter per key (e.g. per IP, or per IP+route). Good enough for
// a single-process Node server; if this is ever scaled to multiple
// processes/instances, swap the in-memory Map for Redis behind the
// same `hit()` interface.
// ============================================================

const buckets = new Map(); // key -> { count, resetAt }

function hit(key, { windowMs, max }) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  return {
    allowed: bucket.count <= max,
    remaining: Math.max(0, max - bucket.count),
    resetAt: bucket.resetAt,
  };
}

// Periodically sweep expired buckets so this Map can't grow forever
// under sustained traffic from many distinct IPs.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref();

function clientIp(req) {
  // Trust X-Forwarded-For only if you control the reverse proxy in
  // front of this server (see deployment notes). Falls back to the
  // raw socket address otherwise.
  const xff = req.headers['x-forwarded-for'];
  if (xff) return xff.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Express-style middleware factory. windowMs/max define the limit;
 * keyFn customizes what's being limited (defaults to per-IP).
 */
function rateLimit({ windowMs, max, keyFn, message }) {
  return (req, res, next) => {
    const key = (keyFn ? keyFn(req) : clientIp(req));
    const result = hit(`${req.method}:${key}`, { windowMs, max });
    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(result.remaining));
    if (!result.allowed) {
      res.setHeader('Retry-After', String(Math.ceil((result.resetAt - Date.now()) / 1000)));
      return res.fail(429, message || 'Too many requests — please slow down.');
    }
    next();
  };
}

module.exports = { rateLimit, clientIp, hit };

// ---------------- Account lockout (brute-force protection) ----------------
// Separate from the IP-based rateLimit above: this tracks failed
// login attempts per *username*, so an attacker can't dodge the
// limit by rotating IPs or proxies. After too many failures the
// account is temporarily locked regardless of which IP is trying.
const failedLogins = new Map(); // username -> { count, lockedUntil }
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function recordFailedLogin(username) {
  const key = String(username || '').toLowerCase();
  const entry = failedLogins.get(key) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= LOCKOUT_THRESHOLD) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  failedLogins.set(key, entry);
}

function clearFailedLogins(username) {
  failedLogins.delete(String(username || '').toLowerCase());
}

function isLockedOut(username) {
  const key = String(username || '').toLowerCase();
  const entry = failedLogins.get(key);
  if (!entry) return { locked: false };
  if (entry.lockedUntil && entry.lockedUntil > Date.now()) {
    return { locked: true, retryAfterSec: Math.ceil((entry.lockedUntil - Date.now()) / 1000) };
  }
  if (entry.lockedUntil && entry.lockedUntil <= Date.now()) {
    failedLogins.delete(key); // lockout expired, reset counter
  }
  return { locked: false };
}

module.exports.recordFailedLogin = recordFailedLogin;
module.exports.clearFailedLogins = clearFailedLogins;
module.exports.isLockedOut = isLockedOut;
