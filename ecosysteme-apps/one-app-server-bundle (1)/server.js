// ============================================================
// server.js — Entry point.
// ============================================================

loadDotEnvIfPresent();

const http = require('http');
const fs = require('fs');
const path = require('path');
const { Router } = require('./lib/router');
const { setCors, setSecurityHeaders } = require('./middleware/auth');
const { rateLimit } = require('./lib/rateLimit');

function loadDotEnvIfPresent() {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Strip a single layer of matching quotes, e.g. KEY="value with spaces"
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

const PORT = process.env.PORT || 8090;
const ADMIN_DIR = fs.realpathSync(path.join(__dirname, 'public'));
const APP_DIR = fs.realpathSync(path.join(__dirname, 'public-app'));

const router = new Router();

// Global rate limit on the whole API surface, in addition to the
// tighter per-route limits (e.g. login) applied inside route files.
// Generous enough not to bother real usage, tight enough to blunt
// scripted abuse against a single-process server.
const globalApiLimit = rateLimit({ windowMs: 60 * 1000, max: 240, message: 'Rate limit exceeded — please slow down.' });

require('./routes/admin').register(router);
require('./routes/publicApi').register(router);
require('./routes/payments').register(router);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

/**
 * Serve a file from a given root directory, with the same
 * symlink-aware path-traversal protection regardless of which root
 * is in play. Returns true if it served something (success or a
 * deliberate 404 for an /api/ path that slipped through), false if
 * the caller should try a different root or fall through to the
 * router.
 */
function serveFromRoot(req, res, rootDir, urlPath) {
  let rel = urlPath === '/' ? '/index.html' : urlPath;
  if (rel.includes('..')) return false;

  const filePath = path.join(rootDir, rel);
  let resolved;
  try {
    resolved = fs.realpathSync(filePath);
  } catch {
    return false; // doesn't exist in this root
  }

  const boundary = rootDir + path.sep;
  if (!resolved.startsWith(boundary) && resolved !== rootDir) return false;
  if (fs.statSync(resolved).isDirectory()) return false;

  const ext = path.extname(resolved);
  res.statusCode = 200;
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  fs.createReadStream(resolved).pipe(res);
  return true;
}

function tryServeStatic(req, res) {
  if (req.method !== 'GET') return false;
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.startsWith('/api/')) return false;

  // Force a trailing slash on the admin root. Without this, the
  // browser resolves the page's relative script/asset paths (./app.js
  // etc.) against "/" instead of "/admin/", since a URL with no
  // trailing slash is treated as a *file*, not a directory — and
  // because public-app/ also happens to have a file named app.js,
  // that wrong resolution fails silently (wrong file loads) rather
  // than 404ing, which makes it a nasty bug to miss in testing.
  if (urlPath === '/admin') {
    res.statusCode = 301;
    res.setHeader('Location', '/admin/');
    res.end();
    return true;
  }

  // /admin/ and /admin/* serve the internal monitoring dashboard.
  if (urlPath === '/admin/') {
    return serveFromRoot(req, res, ADMIN_DIR, '/');
  }
  if (urlPath.startsWith('/admin/')) {
    return serveFromRoot(req, res, ADMIN_DIR, urlPath.slice('/admin'.length));
  }

  // Everything else serves the end-user ONE PWA at the root, so its
  // own relative asset paths (./assets/..., ./manifest.json) work
  // unmodified from how it's built and tested standalone.
  return serveFromRoot(req, res, APP_DIR, urlPath);
}

const server = http.createServer(async (req, res) => {
  // res.json/res.fail are normally attached by the Router inside
  // handle(), but the rate limiter below can short-circuit before
  // we ever reach the router, so define them up front.
  res.json = (obj, status = 200) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };
  res.fail = (status, message, extra = {}) => res.json({ error: message, ...extra }, status);

  setSecurityHeaders(req, res, () => {});
  setCors(req, res, async () => {
    if (res.writableEnded) return;
    if (tryServeStatic(req, res)) return;

    if (req.url.startsWith('/api/')) {
      let blocked = false;
      globalApiLimit(req, res, () => { blocked = false; });
      if (res.writableEnded) return; // the limiter itself responded (429)
    }

    await router.handle(req, res);
  });
});

server.listen(PORT, () => {
  console.log(`ONE backend listening on http://localhost:${PORT}`);
  console.log(`  ONE app (end users):  http://localhost:${PORT}/`);
  console.log(`  Admin dashboard:      http://localhost:${PORT}/admin`);
  console.log(`  Public API base:      http://localhost:${PORT}/api/v1`);
  if (!process.env.ADMIN_ORIGIN) {
    console.log('  [security] ADMIN_ORIGIN not set — admin API is same-origin only (no cross-origin dashboard access). This is correct for the bundled dashboard.');
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log('  [security] NODE_ENV is not "production" — Secure cookie flag and HSTS are disabled. Set NODE_ENV=production before going live.');
  }
});

module.exports = server;
