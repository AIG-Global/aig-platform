// ============================================================
// lib/router.js — A tiny dependency-free HTTP router.
//
// Supports path params (:id), JSON body parsing, query string
// parsing, and a middleware chain per route. This is roughly 80
// lines standing in for Express, scoped exactly to what this
// backend needs — no surprises, no transitive dependencies.
// ============================================================

const { URL } = require('url');

function pathToMatcher(routePath) {
  const paramNames = [];
  const pattern = routePath
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        paramNames.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { regex: new RegExp(`^${pattern}$`), paramNames };
}

class Router {
  constructor() {
    this.routes = []; // { method, matcher, handlers }
  }

  _add(method, routePath, ...handlers) {
    this.routes.push({ method, ...pathToMatcher(routePath), handlers, routePath });
    return this;
  }

  get(p, ...h) { return this._add('GET', p, ...h); }
  post(p, ...h) { return this._add('POST', p, ...h); }
  patch(p, ...h) { return this._add('PATCH', p, ...h); }
  delete(p, ...h) { return this._add('DELETE', p, ...h); }
  put(p, ...h) { return this._add('PUT', p, ...h); }

  async handle(req, res) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);

    req.query = Object.fromEntries(url.searchParams.entries());

    const match = this.routes.find(
      (r) => r.method === req.method && r.regex.test(pathname)
    );

    if (!match) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Not found', path: pathname }));
      return;
    }

    const groups = pathname.match(match.regex).slice(1);
    req.params = {};
    match.paramNames.forEach((name, i) => { req.params[name] = groups[i]; });

    // Parse JSON body for methods that typically carry one.
    if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
      req.body = await parseJsonBody(req).catch(() => ({}));
    } else {
      req.body = {};
    }

    res.json = (obj, status = 200) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(obj));
    };
    res.fail = (status, message, extra = {}) => {
      res.json({ error: message, ...extra }, status);
    };

    // Run handlers in sequence; any handler can short-circuit by
    // sending a response and NOT calling next().
    let i = 0;
    const next = async (err) => {
      if (err) {
        // Full detail goes to the server log only. API clients get a
        // generic message — stack traces and internal error text can
        // reveal file paths, library versions, or query fragments
        // that make an attacker's job easier.
        console.error('[router] handler error:', err);
        if (!res.writableEnded) res.fail(500, 'Internal server error');
        return;
      }
      if (res.writableEnded) return;
      const handler = match.handlers[i++];
      if (!handler) return; // ran out of handlers without responding — fine for some routes
      try {
        await handler(req, res, next);
      } catch (e) {
        next(e);
      }
    };
    await next();
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    let size = 0;
    const MAX = 2 * 1024 * 1024; // 2MB cap, plenty for this API
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX) { reject(new Error('Body too large')); req.destroy(); return; }
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

module.exports = { Router };
