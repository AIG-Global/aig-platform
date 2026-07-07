// ============================================================
// services/analytics.js — All aggregation logic for the
// monitoring dashboard and public API.
//
// Pure functions over the datastore: given the current state of
// users/usage_events/referrals, compute the metrics the admin
// dashboard (and external API consumers) need. Keeping this in
// one module means the admin UI and the public API always agree
// on how a number is computed.
// ============================================================

const Store = require('../lib/store');

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function withinDays(dateStr, days) {
  const t = new Date(dateStr).getTime();
  return t >= daysAgo(days).getTime();
}

/**
 * Clamp a user-supplied numeric query param into a sane range before
 * it's allowed to drive a loop bound or array slice. Without this, a
 * request like ?days=50000000 would make dailyUsage()/signupTrend()
 * allocate tens of millions of entries on a single request — an easy
 * denial-of-service even from an authenticated caller.
 */
function clamp(value, { min = 1, max = 365, fallback }) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

const Analytics = {
  /** High-level numbers for the dashboard header strip. */
  overview() {
    const users = Store.all('users');
    const events = Store.all('usage_events');
    const referrals = Store.all('referrals');

    const free = users.filter(u => u.tier === 'free').length;
    const paid = users.filter(u => u.tier === 'paid').length;
    const activeToday = new Set(
      events.filter(e => withinDays(e.createdAt, 1)).map(e => e.userId)
    ).size;
    const activeWeek = new Set(
      events.filter(e => withinDays(e.createdAt, 7)).map(e => e.userId)
    ).size;
    const conversionRate = users.length ? Math.round((paid / users.length) * 1000) / 10 : 0;
    const pendingInvites = referrals.filter(r => r.status === 'pending').length;

    return {
      totalUsers: users.length,
      freeUsers: free,
      paidUsers: paid,
      conversionRatePct: conversionRate,
      activeToday,
      activeThisWeek: activeWeek,
      totalEvents: events.length,
      pendingInvites,
    };
  },

  /** Daily active usage for the last N days, for a line/bar chart. */
  dailyUsage(days = 30) {
    days = clamp(days, { min: 1, max: 366, fallback: 30 });
    const events = Store.all('usage_events');
    const buckets = {};
    for (let i = days - 1; i >= 0; i--) {
      buckets[isoDate(daysAgo(i))] = { date: isoDate(daysAgo(i)), events: 0, uniqueUsers: new Set() };
    }
    for (const e of events) {
      const day = e.createdAt.slice(0, 10);
      if (buckets[day]) {
        buckets[day].events += 1;
        buckets[day].uniqueUsers.add(e.userId);
      }
    }
    return Object.values(buckets).map(b => ({
      date: b.date,
      events: b.events,
      activeUsers: b.uniqueUsers.size,
    }));
  },

  /** Top users by activity volume — "biggest users." */
  topUsersByActivity(limit = 10, windowDays = 30) {
    limit = clamp(limit, { min: 1, max: 200, fallback: 10 });
    windowDays = clamp(windowDays, { min: 1, max: 366, fallback: 30 });
    const users = Store.all('users');
    const events = Store.all('usage_events').filter(e => withinDays(e.createdAt, windowDays));
    const counts = new Map();
    for (const e of events) counts.set(e.userId, (counts.get(e.userId) || 0) + 1);

    const ranked = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([userId, count]) => {
        const u = users.find(u => u.id === userId);
        return u ? {
          userId, name: u.name, tier: u.tier, country: u.country,
          eventCount: count, assistantName: u.assistantName,
        } : null;
      })
      .filter(Boolean);
    return ranked;
  },

  /** Top sharers by number of referrals sent / converted — "biggest sharers." */
  topSharers(limit = 10) {
    limit = clamp(limit, { min: 1, max: 200, fallback: 10 });
    const users = Store.all('users');
    const referrals = Store.all('referrals');
    const bySponsor = new Map();
    for (const r of referrals) {
      if (!bySponsor.has(r.sponsorUserId)) {
        bySponsor.set(r.sponsorUserId, { sent: 0, joinedFree: 0, joinedPaid: 0 });
      }
      const bucket = bySponsor.get(r.sponsorUserId);
      bucket.sent += 1;
      if (r.status === 'joined_free') bucket.joinedFree += 1;
      if (r.status === 'joined_paid') bucket.joinedPaid += 1;
    }
    const ranked = [...bySponsor.entries()]
      .map(([sponsorId, stats]) => {
        const u = users.find(u => u.id === sponsorId);
        const joined = stats.joinedFree + stats.joinedPaid;
        return u ? {
          userId: sponsorId, name: u.name, tier: u.tier,
          invitesSent: stats.sent, invitesJoined: joined,
          joinedFree: stats.joinedFree, joinedPaid: stats.joinedPaid,
          conversionRate: stats.sent ? Math.round((joined / stats.sent) * 100) : 0,
        } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.invitesJoined - a.invitesJoined)
      .slice(0, limit);
    return ranked;
  },

  /** Most-used topics/fields across the whole user base. */
  topTopics(limit = 15, windowDays = 30) {
    limit = clamp(limit, { min: 1, max: 200, fallback: 15 });
    windowDays = clamp(windowDays, { min: 1, max: 366, fallback: 30 });
    const events = Store.all('usage_events').filter(e => withinDays(e.createdAt, windowDays));
    const counts = new Map();
    for (const e of events) counts.set(e.topic, (counts.get(e.topic) || 0) + 1);
    const total = events.length || 1;
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([topic, count]) => ({ topic, count, sharePct: Math.round((count / total) * 1000) / 10 }));
  },

  /** Usage broken down by domain (nav section), for a "fields of use" view. */
  domainBreakdown(windowDays = 30) {
    windowDays = clamp(windowDays, { min: 1, max: 366, fallback: 30 });
    const events = Store.all('usage_events').filter(e => withinDays(e.createdAt, windowDays));
    const counts = new Map();
    for (const e of events) counts.set(e.domain, (counts.get(e.domain) || 0) + 1);
    const total = events.length || 1;
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([domain, count]) => ({ domain, count, sharePct: Math.round((count / total) * 1000) / 10 }));
  },

  /** Voice vs typed command split — useful given the voice-command feature. */
  inputModeSplit(windowDays = 30) {
    windowDays = clamp(windowDays, { min: 1, max: 366, fallback: 30 });
    const events = Store.all('usage_events').filter(e => withinDays(e.createdAt, windowDays) && (e.type === 'command' || e.type === 'voice_command'));
    const voice = events.filter(e => e.type === 'voice_command').length;
    const typed = events.length - voice;
    return { voice, typed, total: events.length };
  },

  /** Free vs paid segmentation — counts, growth, and behavioral differences. */
  segmentation(windowDays = 30) {
    windowDays = clamp(windowDays, { min: 1, max: 366, fallback: 30 });
    const users = Store.all('users');
    const events = Store.all('usage_events').filter(e => withinDays(e.createdAt, windowDays));

    const free = users.filter(u => u.tier === 'free');
    const paid = users.filter(u => u.tier === 'paid');

    function avgEventsPerUser(group) {
      if (!group.length) return 0;
      const ids = new Set(group.map(u => u.id));
      const count = events.filter(e => ids.has(e.userId)).length;
      return Math.round((count / group.length) * 10) / 10;
    }

    const adminOverrides = users.filter(u => u.upgradeSource === 'admin_override').length;
    const networkUpgrades = users.filter(u => u.upgradeSource === 'network').length;

    return {
      free: { count: free.length, avgEventsPerUser: avgEventsPerUser(free) },
      paid: { count: paid.length, avgEventsPerUser: avgEventsPerUser(paid) },
      upgradeSources: { network: networkUpgrades, adminOverride: adminOverrides },
    };
  },

  /** Country breakdown — where the user base actually is. */
  byCountry(limit = 12) {
    limit = clamp(limit, { min: 1, max: 200, fallback: 12 });
    const users = Store.all('users');
    const counts = new Map();
    for (const u of users) counts.set(u.country, (counts.get(u.country) || 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([country, count]) => ({ country, count }));
  },

  /** New signups per day for the last N days — growth curve. */
  signupTrend(days = 30) {
    days = clamp(days, { min: 1, max: 366, fallback: 30 });
    const users = Store.all('users');
    const buckets = {};
    for (let i = days - 1; i >= 0; i--) buckets[isoDate(daysAgo(i))] = 0;
    for (const u of users) {
      const day = u.createdAt.slice(0, 10);
      if (day in buckets) buckets[day] += 1;
    }
    return Object.entries(buckets).map(([date, count]) => ({ date, signups: count }));
  },
};

module.exports = Analytics;
