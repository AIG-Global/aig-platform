// ============================================================
// services/auth.js — Admin session auth + API key auth.
//
// No external dependencies (no jsonwebtoken, no bcrypt). Built on
// Node's crypto module:
//   - Passwords: PBKDF2 with a per-password random salt.
//   - Admin sessions: random opaque tokens, stored server-side in
//     the `sessions` table with an expiry — i.e. classic server
//     session tokens, not JWTs. Simpler, fully revocable, and fine
//     for an internal admin tool.
//   - API keys: random tokens, stored hashed (SHA-256) so the raw
//     key is only ever shown once (at creation time), the same
//     practice Stripe/GitHub use for API keys.
// ============================================================

const crypto = require('crypto');
const Store = require('../lib/store');

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const PBKDF2_ITERATIONS = 100000;

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, 'sha256').toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password, stored) {
  if (stored.includes(':')) {
    const [salt, derived] = stored.split(':');
    const check = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, 'sha256').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(check, 'hex'), Buffer.from(derived, 'hex'));
  }
  // Backward-compat for the plain sha256 used by the seed script's quick demo hash.
  return sha256(password) === stored;
}

const Auth = {
  hashPassword,
  verifyPassword,

  // ---------------- Admin sessions ----------------
  async login(username, password) {
    const admin = Store.findOne('admins', a => a.username === username);
    if (!admin) return null;
    if (!verifyPassword(password, admin.passwordHash)) return null;

    const token = crypto.randomBytes(32).toString('base64url');
    await Store.insert('sessions', {
      token,
      adminId: admin.id,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    });
    return { token, admin: { id: admin.id, username: admin.username } };
  },

  async logout(token) {
    const session = Store.findOne('sessions', s => s.token === token);
    if (session) await Store.remove('sessions', session.id);
  },

  getSessionAdmin(token) {
    if (!token) return null;
    const session = Store.findOne('sessions', s => s.token === token);
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() < Date.now()) return null;
    const admin = Store.get('admins', session.adminId);
    return admin ? { id: admin.id, username: admin.username } : null;
  },

  // ---------------- API keys ----------------
  async createApiKey(label, scopes = ['analytics:read']) {
    const raw = 'one_live_' + crypto.randomBytes(24).toString('base64url');
    const record = await Store.insert('api_keys', {
      label,
      key: sha256(raw),
      keyPreview: raw.slice(0, 14) + '…' + raw.slice(-4),
      scopes,
      active: true,
      lastUsedAt: null,
    });
    // The raw key is returned ONCE — callers must store it now.
    return { ...record, rawKey: raw };
  },

  async revokeApiKey(keyId) {
    return Store.update('api_keys', keyId, { active: false, revokedAt: Store.nowISO() });
  },

  async validateApiKey(rawKey, requiredScope = null) {
    if (!rawKey) return null;
    const hashed = sha256(rawKey);
    const record = Store.findOne('api_keys', k => k.key === hashed && k.active);
    if (!record) return null;
    if (requiredScope && !record.scopes.includes(requiredScope)) return null;
    await Store.update('api_keys', record.id, { lastUsedAt: Store.nowISO() });
    return record;
  },

  listApiKeys() {
    // Never return the hashed key itself in listings, only the preview.
    return Store.all('api_keys').map(({ key, ...rest }) => rest);
  },
};

module.exports = Auth;
