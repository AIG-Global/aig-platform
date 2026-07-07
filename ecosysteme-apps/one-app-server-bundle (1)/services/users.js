// ============================================================
// services/users.js — User lookups and tier-change operations.
//
// The important distinction enforced here: there are TWO distinct
// ways a free user becomes paid, and they must never be conflated:
//
//   1. normalUpgrade()   — the regular product flow. This is what
//      happens when a user pays for a package through the app.
//      It DOES generate AIG network bonuses (sponsor commission,
//      network pool credit) because real money moved through the
//      network.
//
//   2. adminOverrideUpgrade() — a support/goodwill action taken by
//      an administrator outside the normal purchase flow (e.g.
//      compensation, promo, internal testing). This intentionally
//      SKIPS all network bonus generation, is restricted to admin
//      callers, and is always written to the admin_actions audit
//      log with the admin's id and a reason.
//
// Routes must never call Store.update() on a user's tier directly —
// always go through one of these two functions so the bonus
// behaviour and audit trail stay correct.
// ============================================================

const Store = require('../lib/store');

const Users = {
  list({ tier, q, limit = 50, offset = 0 } = {}) {
    let users = Store.all('users');
    if (tier) users = users.filter(u => u.tier === tier);
    if (q) {
      const needle = q.toLowerCase();
      users = users.filter(u => u.name.toLowerCase().includes(needle) || u.email.toLowerCase().includes(needle) || u.memberCode.toLowerCase().includes(needle));
    }
    const total = users.length;
    const page = users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);
    return { total, users: page };
  },

  get(userId) {
    return Store.get('users', userId);
  },

  /**
   * Normal, revenue-generating upgrade. Call this from the real
   * checkout/payment flow only. Generates network bonus events.
   */
  async normalUpgrade(userId, { adminId = null } = {}) {
    const user = Store.get('users', userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'paid') throw new Error('User is already paid');

    const updated = await Store.update('users', userId, {
      tier: 'paid',
      upgradedAt: Store.nowISO(),
      upgradeSource: 'network',
    });

    // Generate the network bonus event (sponsor commission etc.)
    // This is intentionally a separate, clearly-labelled event so
    // analytics can always tell bonus-bearing upgrades apart from
    // admin overrides.
    await Store.insert('network_bonus_events', {
      userId,
      sponsorUserId: user.sponsorUserId,
      reason: 'paid_upgrade',
      bonusGenerated: true,
    });

    return updated;
  },

  /**
   * Admin-initiated upgrade that bypasses payment AND bypasses
   * network bonus generation. Use for goodwill, support resolution,
   * internal test accounts, etc. Always requires an admin id and a
   * human-readable reason, and always writes to admin_actions.
   */
  async adminOverrideUpgrade(userId, { adminId, reason }) {
    if (!adminId) throw new Error('adminId is required for an admin override');
    if (!reason || !reason.trim()) throw new Error('A reason is required for an admin override');

    const user = Store.get('users', userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'paid') throw new Error('User is already paid');

    const updated = await Store.update('users', userId, {
      tier: 'paid',
      upgradedAt: Store.nowISO(),
      upgradeSource: 'admin_override',
    });

    // Explicitly record that NO network bonus was generated.
    await Store.insert('network_bonus_events', {
      userId,
      sponsorUserId: user.sponsorUserId,
      reason: 'admin_override',
      bonusGenerated: false,
    });

    await Store.insert('admin_actions', {
      adminId,
      action: 'upgrade_override',
      targetUserId: userId,
      details: {
        reason: reason.trim(),
        previousTier: 'free',
        newTier: 'paid',
        bonusGenerated: false,
      },
    });

    return updated;
  },

  /** Admin can also revert someone to free (e.g. correcting a mistake). */
  async adminDowngrade(userId, { adminId, reason }) {
    if (!adminId) throw new Error('adminId is required');
    const user = Store.get('users', userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'free') throw new Error('User is already free');

    const updated = await Store.update('users', userId, {
      tier: 'free',
      upgradeSource: null,
    });

    await Store.insert('admin_actions', {
      adminId,
      action: 'downgrade',
      targetUserId: userId,
      details: { reason: (reason || '').trim(), previousTier: 'paid', newTier: 'free' },
    });

    return updated;
  },

  /** Full admin action history for a given user, most recent first. */
  actionsFor(userId) {
    return Store.find('admin_actions', a => a.targetUserId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /** Network bonus events for a user — useful to verify "no bonus" admin overrides. */
  bonusEventsFor(userId) {
    return Store.find('network_bonus_events', e => e.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
};

module.exports = Users;
