// ============================================================
// routes/publicApi.js — The external-facing API for the
// "upcoming webservice" integration. Every route here requires a
// valid API key (see services/auth.js + middleware/auth.js).
//
// This is deliberately read-mostly and scoped: an external
// webservice gets exactly what it needs (analytics snapshots,
// user lookups by id/code) without any path to mutate billing-
// sensitive fields like tier — that stays admin-only.
// ============================================================

const Analytics = require('../services/analytics');
const Users = require('../services/users');
const Store = require('../lib/store');
const { requireApiKey } = require('../middleware/auth');
const { rateLimit } = require('../lib/rateLimit');

// Scoped to the API key rather than IP, since legitimate webservice
// traffic for many end-users will share one or few server IPs but
// should still be bounded per credential.
const eventsRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  keyFn: (req) => req.apiKey?.id || 'unkeyed',
  message: 'Event ingestion rate limit exceeded for this API key.',
});

const MAX_META_BYTES = 4 * 1024; // 4KB — generous for tags/context, not enough to be a storage attack

function register(router) {
  router.get('/api/v1/health', (req, res) => {
    res.json({ ok: true, service: 'ONE backend', time: new Date().toISOString() });
  });

  router.get('/api/v1/analytics/overview', requireApiKey('analytics:read'), (req, res) => {
    res.json(Analytics.overview());
  });

  router.get('/api/v1/analytics/daily-usage', requireApiKey('analytics:read'), (req, res) => {
    res.json(Analytics.dailyUsage(Number(req.query.days) || 30));
  });

  router.get('/api/v1/analytics/top-topics', requireApiKey('analytics:read'), (req, res) => {
    res.json(Analytics.topTopics(Number(req.query.limit) || 15, Number(req.query.windowDays) || 30));
  });

  router.get('/api/v1/analytics/segmentation', requireApiKey('analytics:read'), (req, res) => {
    res.json(Analytics.segmentation(Number(req.query.windowDays) || 30));
  });

  // Look up a single user — STRICTLY by exact id or exact member
  // code, never a fuzzy/partial match. A broader search here would
  // let any events:read-scoped caller enumerate users by guessing
  // fragments of names or emails.
  router.get('/api/v1/users/:id', requireApiKey('users:read'), (req, res) => {
    const lookup = req.params.id;
    let user = Users.get(lookup);
    if (!user) {
      user = Store.findOne('users', (u) => u.memberCode === lookup);
    }
    if (!user) return res.fail(404, 'User not found');
    res.json({
      id: user.id,
      name: user.name,
      country: user.country,
      tier: user.tier,
      memberCode: user.memberCode,
      createdAt: user.createdAt,
    });
  });

  // Event ingestion: lets the frontend (or any client) log a usage
  // event. This is how real usage would flow into the analytics
  // shown above instead of seed data, once the webservice is wired up.
  router.post('/api/v1/events', eventsRateLimit, requireApiKey('events:write'), async (req, res) => {
    const { userId, type, topic, domain, meta } = req.body;
    if (!userId || !type) return res.fail(400, 'userId and type are required');

    // Reject events for users that don't exist — otherwise this
    // endpoint becomes an unauthenticated-in-effect way to grow the
    // datastore with arbitrary junk tied to fabricated ids, which
    // both wastes storage and pollutes every analytics view above.
    const user = Users.get(userId);
    if (!user) return res.fail(404, 'Unknown userId');

    let safeMeta = {};
    if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
      const serialized = JSON.stringify(meta);
      if (Buffer.byteLength(serialized) > MAX_META_BYTES) {
        return res.fail(400, `meta is too large (max ${MAX_META_BYTES} bytes)`);
      }
      safeMeta = meta;
    }

    const ALLOWED_TYPES = ['command', 'voice_command', 'domain_view', 'login'];
    const safeType = ALLOWED_TYPES.includes(type) ? type : 'other';

    const event = await Store.insert('usage_events', {
      userId,
      type: safeType,
      topic: String(topic || 'unspecified').slice(0, 80),
      domain: String(domain || 'unknown').slice(0, 40),
      meta: safeMeta,
    }, { maxRecords: 500000 }); // generous ceiling; oldest events roll off rather than growing forever
    res.json({ ok: true, event });
  });
}

module.exports = { register };
