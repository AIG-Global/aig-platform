// ============================================================
// middleware/auth.js — Guards for admin-only and API-key-only
// routes, plus shared security middleware (CORS, security headers).
// ============================================================

const Auth = require('../services/auth');

function getCookie(req, name) {
  const header = req.headers.cookie;
  if (!header) return null;
  const match = header.split(';').map(s => s.trim()).find(s => s.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

/** Requires a valid admin session cookie (set at login). */
function requireAdmin(req, res, next) {
  const token = getCookie(req, 'one_admin_session') || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const admin = Auth.getSessionAdmin(token);
  if (!admin) return res.fail(401, 'Admin authentication required');
  req.admin = admin;
  next();
}

/** Requires a valid API key in the Authorization header or x-api-key header, with an optional scope. */
function requireApiKey(scope = null) {
  return async (req, res, next) => {
    const headerKey = req.headers['x-api-key'] || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const record = await Auth.validateApiKey(headerKey, scope);
    if (!record) return res.fail(401, 'Valid API key required', { hint: 'Pass it as x-api-key header or Authorization: Bearer <key>' });
    req.apiKey = record;
    next();
  };
}

// Cookie-authenticated admin routes must NEVER be reachable with a
// wildcard CORS origin — a wildcard plus credentials is what lets a
// malicious site ride a logged-in admin's session. Configure the
// real admin dashboard origin(s) via ADMIN_ORIGIN (comma-separated)
// in production; defaults to same-origin only (no CORS header sent),
// which is correct for the bundled dashboard at public/.
const ADMIN_ORIGINS = (process.env.ADMIN_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);

// The public, API-key-authenticated webservice API has no cookies
// involved, so an open CORS policy there is safe by design — any
// caller still needs a valid key in a header to get data back.
function setCors(req, res, next) {
  const origin = req.headers.origin;
  const isAdminRoute = req.url.startsWith('/api/admin');

  if (isAdminRoute) {
    // Only echo back an explicitly allow-listed origin, and only
    // with credentials enabled for that specific origin — never '*'.
    if (origin && ADMIN_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    }
    // If no match, no CORS headers are sent at all, which makes the
    // browser block cross-origin reads — same-origin requests (the
    // bundled dashboard) are unaffected since browsers don't apply
    // CORS to same-origin calls in the first place.
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  next();
}

/** Baseline security headers — cheap to set, meaningfully reduce common web attack surface. */
function setSecurityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  }

  const isAdminPath = req.url.startsWith('/admin');

  // The admin dashboard never needs the microphone/camera and should
  // never be framed by anything; the end-user ONE app explicitly
  // needs microphone access for its voice command feature, so the
  // two surfaces get different Permissions-Policy / frame rules.
  if (isAdminPath) {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  } else {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(self)');
  }

  // Both surfaces are small, first-party static builds with no inline
  // <script> tags, so a same-origin-only CSP is correct for both.
  if (!req.url.startsWith('/api/')) {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; manifest-src 'self';");
  }
  next();
}

module.exports = { requireAdmin, requireApiKey, setCors, setSecurityHeaders, getCookie };
