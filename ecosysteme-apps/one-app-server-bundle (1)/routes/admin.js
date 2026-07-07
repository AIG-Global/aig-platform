// ============================================================
// routes/admin.js — Admin-only routes: login, dashboard data,
// user management, the no-bonus upgrade override, API key admin.
// ============================================================

const Auth = require('../services/auth');
const Analytics = require('../services/analytics');
const Users = require('../services/users');
const Store = require('../lib/store');
const { requireAdmin } = require('../middleware/auth');
const { rateLimit, recordFailedLogin, clearFailedLogins, isLockedOut } = require('../lib/rateLimit');

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per IP per 15 minutes, independent of the per-account lockout below
  message: 'Too many login attempts from this address. Try again later.',
});

function register(router) {
  // ---------------- Auth ----------------
  router.post('/api/admin/login', loginRateLimit, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.fail(400, 'username and password are required');

    const lockout = isLockedOut(username);
    if (lockout.locked) {
      res.setHeader('Retry-After', String(lockout.retryAfterSec));
      return res.fail(429, `Too many failed attempts for this account. Try again in ${Math.ceil(lockout.retryAfterSec / 60)} minute(s).`);
    }

    const result = await Auth.login(username, password);
    if (!result) {
      recordFailedLogin(username);
      // Deliberately vague — never reveal whether the username exists.
      return res.fail(401, 'Invalid username or password');
    }
    clearFailedLogins(username);

    const isProd = process.env.NODE_ENV === 'production';
    res.setHeader(
      'Set-Cookie',
      `one_admin_session=${result.token}; HttpOnly; Path=/; Max-Age=43200; SameSite=Strict${isProd ? '; Secure' : ''}`
    );
    // The token is only ever delivered via the HttpOnly cookie — never
    // echoed in the response body, so script-based access (XSS) can't
    // read it even if a vulnerability exists elsewhere on the page.
    res.json({ admin: result.admin });
  });

  router.post('/api/admin/logout', requireAdmin, async (req, res) => {
    const token = (req.headers.cookie || '').split('one_admin_session=')[1]?.split(';')[0];
    if (token) await Auth.logout(token);
    const isProd = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', `one_admin_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${isProd ? '; Secure' : ''}`);
    res.json({ ok: true });
  });

  router.get('/api/admin/me', requireAdmin, (req, res) => {
    res.json({ admin: req.admin });
  });

  // ---------------- Dashboard analytics (admin-session protected) ----------------
  router.get('/api/admin/overview', requireAdmin, (req, res) => {
    res.json(Analytics.overview());
  });

  router.get('/api/admin/daily-usage', requireAdmin, (req, res) => {
    const days = Number(req.query.days) || 30;
    res.json(Analytics.dailyUsage(days));
  });

  router.get('/api/admin/top-users', requireAdmin, (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const windowDays = Number(req.query.windowDays) || 30;
    res.json(Analytics.topUsersByActivity(limit, windowDays));
  });

  router.get('/api/admin/top-sharers', requireAdmin, (req, res) => {
    const limit = Number(req.query.limit) || 10;
    res.json(Analytics.topSharers(limit));
  });

  router.get('/api/admin/top-topics', requireAdmin, (req, res) => {
    const limit = Number(req.query.limit) || 15;
    const windowDays = Number(req.query.windowDays) || 30;
    res.json(Analytics.topTopics(limit, windowDays));
  });

  router.get('/api/admin/domain-breakdown', requireAdmin, (req, res) => {
    const windowDays = Number(req.query.windowDays) || 30;
    res.json(Analytics.domainBreakdown(windowDays));
  });

  router.get('/api/admin/input-mode-split', requireAdmin, (req, res) => {
    const windowDays = Number(req.query.windowDays) || 30;
    res.json(Analytics.inputModeSplit(windowDays));
  });

  router.get('/api/admin/segmentation', requireAdmin, (req, res) => {
    const windowDays = Number(req.query.windowDays) || 30;
    res.json(Analytics.segmentation(windowDays));
  });

  router.get('/api/admin/by-country', requireAdmin, (req, res) => {
    res.json(Analytics.byCountry(Number(req.query.limit) || 12));
  });

  router.get('/api/admin/signup-trend', requireAdmin, (req, res) => {
    res.json(Analytics.signupTrend(Number(req.query.days) || 30));
  });

  // ---------------- User management ----------------
  router.get('/api/admin/users', requireAdmin, (req, res) => {
    const { tier, q } = req.query;
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    res.json(Users.list({ tier, q, limit, offset }));
  });

  router.get('/api/admin/users/:id', requireAdmin, (req, res) => {
    const user = Users.get(req.params.id);
    if (!user) return res.fail(404, 'User not found');
    res.json({
      user,
      adminActions: Users.actionsFor(user.id),
      bonusEvents: Users.bonusEventsFor(user.id),
    });
  });

  // The key endpoint you asked for: let an admin upgrade a free
  // user to paid OUTSIDE the normal purchase flow, with NO network
  // bonus generated. Requires a reason; fully audit-logged.
  router.post('/api/admin/users/:id/upgrade-override', requireAdmin, async (req, res) => {
    const { reason } = req.body;
    try {
      const updated = await Users.adminOverrideUpgrade(req.params.id, { adminId: req.admin.id, reason });
      res.json({ ok: true, user: updated });
    } catch (err) {
      res.fail(400, err.message);
    }
  });

  router.post('/api/admin/users/:id/downgrade', requireAdmin, async (req, res) => {
    const { reason } = req.body;
    try {
      const updated = await Users.adminDowngrade(req.params.id, { adminId: req.admin.id, reason });
      res.json({ ok: true, user: updated });
    } catch (err) {
      res.fail(400, err.message);
    }
  });

  // ---------------- Admin action audit log ----------------
  router.get('/api/admin/actions', requireAdmin, (req, res) => {
    const actions = Store.all('admin_actions').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const users = Store.all('users');
    const admins = Store.all('admins');
    const enriched = actions.map(a => ({
      ...a,
      targetUserName: users.find(u => u.id === a.targetUserId)?.name || null,
      adminUsername: admins.find(ad => ad.id === a.adminId)?.username || null,
    }));
    res.json(enriched);
  });

  // ---------------- API key management ----------------
  router.get('/api/admin/api-keys', requireAdmin, (req, res) => {
    res.json(Auth.listApiKeys());
  });

  router.post('/api/admin/api-keys', requireAdmin, async (req, res) => {
    const { label, scopes } = req.body;
    if (!label) return res.fail(400, 'label is required');
    const created = await Auth.createApiKey(label, Array.isArray(scopes) && scopes.length ? scopes : ['analytics:read']);
    res.json(created); // includes rawKey ONCE
  });

  router.post('/api/admin/api-keys/:id/revoke', requireAdmin, async (req, res) => {
    const updated = await Auth.revokeApiKey(req.params.id);
    if (!updated) return res.fail(404, 'API key not found');
    res.json({ ok: true, key: updated });
  });
}

module.exports = { register };
