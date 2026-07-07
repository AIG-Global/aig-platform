// ============================================================
// scripts/seed.js — Populate the datastore with realistic demo
// data so the admin dashboard and API have something to show.
//
// Run with: node scripts/seed.js
//
// ------------------------------------------------------------
// DATA MODEL (each table = one JSON file in /data)
// ------------------------------------------------------------
// users
//   id, name, email, country, assistantName, tier ('free'|'paid'),
//   sponsorUserId (nullable), memberCode, createdAt,
//   upgradedAt, upgradeSource ('network'|'admin_override'|null)
//
// usage_events
//   id, userId, type ('command'|'voice_command'|'domain_view'|'login'|...),
//   topic (free-text category e.g. 'finance.runway', 'aig.network'),
//   domain (nav domain id e.g. 'finance','sales','aig','health'),
//   meta (free-form object), createdAt
//
// referrals
//   id, sponsorUserId, invitedUserId (nullable until joined),
//   inviteCode, status ('pending'|'joined_free'|'joined_paid'),
//   createdAt, joinedAt
//
// admin_actions
//   id, adminId, action ('upgrade_override'|'downgrade'|'create_api_key'|'revoke_api_key'|...),
//   targetUserId (nullable), details (object), createdAt
//
// api_keys
//   id, label, key (hashed), scopes (array), active, createdAt, lastUsedAt
//
// admins
//   id, username, passwordHash, createdAt
// ============================================================

const Store = require('../lib/store');
const Auth = require('../services/auth');
const crypto = require('crypto');

function hash(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

const COUNTRIES = ['Finland', 'Sweden', 'Germany', 'United Kingdom', 'United States', 'Estonia', 'United Arab Emirates', 'France', 'Spain'];
const TOPICS = [
  'finance.runway', 'finance.burn', 'sales.pipeline', 'sales.deal_risk',
  'ops.contracts', 'ops.projects', 'people.attrition', 'people.hiring',
  'legal.contract_review', 'legal.document_draft', 'aig.wallet', 'aig.network',
  'aig.commission', 'health.vitals', 'health.emergency_demo', 'invite.share',
  'briefing.morning', 'settings.voice', 'settings.language',
];
const DOMAINS = ['home', 'finance', 'sales', 'ops', 'people', 'legal', 'aig', 'health', 'invite', 'memory', 'settings'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function daysAgoISO(days, hour = randInt(6, 22)) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, randInt(0, 59), 0, 0);
  return d.toISOString();
}

const FIRST_NAMES = ['Markus', 'Liisa', 'Janne', 'Aino', 'Topi', 'Reetta', 'Petri', 'Hannu', 'Sofia', 'Elias', 'Nora', 'Oskari', 'Emma', 'Leo', 'Maja', 'Viktor', 'Ines', 'Sami', 'Tuuli', 'Aleksi', 'Greta', 'Mikko', 'Anni', 'Otto', 'Vera', 'Henrik', 'Saara', 'Niklas', 'Ronja', 'Joel'];
const LAST_NAMES = ['Eklund', 'Virtanen', 'Salonen', 'Nieminen', 'Mäkelä', 'Laine', 'Räsänen', 'Korhonen', 'Lindholm', 'Saarinen', 'Heikkinen', 'Järvinen', 'Hämäläinen', 'Koskinen', 'Lehtonen'];

async function seed() {
  console.log('Seeding ONE backend datastore...');

  // ---------------- Admins ----------------
  const admins = [
    { id: Store.id('admin'), username: 'admin', passwordHash: Auth.hashPassword('aig-admin-2026'), createdAt: Store.nowISO() },
  ];
  await Store.replaceAll('admins', admins);

  // ---------------- Users ----------------
  const users = [];
  const numUsers = 220;

  // Founder/root user (paid, no sponsor) — matches the frontend demo user
  const rootUser = {
    id: Store.id('user'), name: 'Markus Eklund', email: 'markus@example.com',
    country: 'Finland', assistantName: 'ONE', tier: 'paid',
    sponsorUserId: null, memberCode: 'ME8841',
    createdAt: daysAgoISO(180), upgradedAt: daysAgoISO(178), upgradeSource: 'network',
  };
  users.push(rootUser);

  for (let i = 0; i < numUsers; i++) {
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    const createdDaysAgo = randInt(1, 175);
    const isPaid = Math.random() < 0.28; // ~28% paid conversion, realistic-ish
    const sponsor = Math.random() < 0.7 ? pick(users).id : rootUser.id; // most have a sponsor
    const upgradeSource = isPaid ? (Math.random() < 0.08 ? 'admin_override' : 'network') : null;
    users.push({
      id: Store.id('user'),
      name,
      email: name.toLowerCase().replace(' ', '.') + '@example.com',
      country: pick(COUNTRIES),
      assistantName: pick(['ONE', 'Nova', 'Atlas', 'Aria', 'Sol', 'Felix', 'Luna']),
      tier: isPaid ? 'paid' : 'free',
      sponsorUserId: sponsor,
      memberCode: 'M' + crypto.randomBytes(4).toString('hex').toUpperCase(),
      createdAt: daysAgoISO(createdDaysAgo),
      upgradedAt: isPaid ? daysAgoISO(randInt(0, createdDaysAgo)) : null,
      upgradeSource,
    });
  }
  await Store.replaceAll('users', users);

  // ---------------- Usage events ----------------
  const events = [];
  for (const user of users) {
    const createdAt = new Date(user.createdAt);
    const daysSinceJoin = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / 86400000));
    // Active users generate events on a good fraction of days since joining
    const activeDays = randInt(1, Math.min(daysSinceJoin, 60));
    const eventsPerActiveDay = user.tier === 'paid' ? randInt(3, 14) : randInt(1, 6);

    for (let d = 0; d < activeDays; d++) {
      const dayOffset = randInt(0, Math.min(daysSinceJoin, 60));
      const numEventsToday = randInt(1, eventsPerActiveDay);
      for (let e = 0; e < numEventsToday; e++) {
        const isVoice = Math.random() < 0.22;
        const domain = user.tier === 'paid' ? pick(DOMAINS) : pick(['home', 'health', 'invite', 'memory', 'settings']);
        events.push({
          id: Store.id('evt'),
          userId: user.id,
          type: isVoice ? 'voice_command' : pick(['command', 'domain_view', 'domain_view']),
          topic: pick(TOPICS),
          domain,
          meta: {},
          createdAt: daysAgoISO(dayOffset),
        });
      }
    }
  }
  await Store.replaceAll('usage_events', events);

  // ---------------- Referrals ----------------
  const referrals = [];
  for (const user of users) {
    if (!user.sponsorUserId) continue;
    referrals.push({
      id: Store.id('ref'),
      sponsorUserId: user.sponsorUserId,
      invitedUserId: user.id,
      inviteCode: pick(users).memberCode,
      status: user.tier === 'paid' ? 'joined_paid' : 'joined_free',
      createdAt: user.createdAt,
      joinedAt: user.createdAt,
    });
  }
  // A few pending (sent but not joined) invites for realism
  for (let i = 0; i < 18; i++) {
    referrals.push({
      id: Store.id('ref'),
      sponsorUserId: pick(users).id,
      invitedUserId: null,
      inviteCode: pick(users).memberCode,
      status: 'pending',
      createdAt: daysAgoISO(randInt(0, 30)),
      joinedAt: null,
    });
  }
  await Store.replaceAll('referrals', referrals);

  // ---------------- API keys ----------------
  const apiKeys = [
    {
      id: Store.id('key'),
      label: 'AIG Webservice (production)',
      key: hash('demo-api-key-do-not-use-in-prod'),
      keyPreview: 'one_live_' + crypto.randomBytes(3).toString('hex'),
      scopes: ['analytics:read', 'users:read', 'events:write'],
      active: true,
      createdAt: daysAgoISO(40),
      lastUsedAt: daysAgoISO(0, 9),
    },
  ];
  await Store.replaceAll('api_keys', apiKeys);

  // ---------------- Admin action log ----------------
  const adminActions = [];
  const overrideUsers = users.filter(u => u.upgradeSource === 'admin_override');
  for (const u of overrideUsers) {
    adminActions.push({
      id: Store.id('act'),
      adminId: admins[0].id,
      action: 'upgrade_override',
      targetUserId: u.id,
      details: { reason: 'Manual goodwill upgrade — no network bonus generated', previousTier: 'free', newTier: 'paid', bonusGenerated: false },
      createdAt: u.upgradedAt,
    });
  }
  await Store.replaceAll('admin_actions', adminActions);

  // ---------------- Network bonus events ----------------
  // Mirrors how every paid user *got* paid — admin overrides explicitly
  // generate no bonus, everyone else (network upgrades) does.
  const bonusEvents = [];
  for (const u of users) {
    if (u.tier !== 'paid') continue;
    bonusEvents.push({
      id: Store.id('bonus'),
      userId: u.id,
      sponsorUserId: u.sponsorUserId,
      reason: u.upgradeSource === 'admin_override' ? 'admin_override' : 'paid_upgrade',
      bonusGenerated: u.upgradeSource !== 'admin_override',
      createdAt: u.upgradedAt || u.createdAt,
    });
  }
  await Store.replaceAll('network_bonus_events', bonusEvents);

  // ---------------- Sessions (start empty) ----------------
  await Store.replaceAll('sessions', []);

  // ---------------- Payments (NOWPayments demo history) ----------------
  // Every network-upgraded user (i.e. not admin_override) gets a
  // matching confirmed payment record, as if they'd actually paid
  // via NOWPayments. A few extra pending/failed/expired payments
  // are added for free users who started but didn't finish checkout.
  const PKG_BY_PRICE = [
    { code: 'A', priceUSD: 399 },
    { code: 'B', priceUSD: 699 },
    { code: 'C', priceUSD: 1099 },
    { code: 'PROFESSIONAL', priceUSD: 2999 },
  ];
  const payments = [];
  for (const u of users) {
    if (u.tier === 'paid' && u.upgradeSource === 'network') {
      const pkg = pick(PKG_BY_PRICE);
      payments.push({
        id: Store.id('payments'),
        userId: u.id,
        packageCode: pkg.code,
        priceUSD: pkg.priceUSD,
        provider: 'nowpayments',
        status: 'confirmed',
        providerPaymentId: String(randInt(5000000000, 5999999999)),
        providerInvoiceId: String(randInt(4000000000, 4999999999)),
        providerInvoiceUrl: null,
        payCurrency: pick(['btc', 'eth', 'usdttrc20', 'ltc', 'usdc']),
        actuallyPaid: pkg.priceUSD,
        upgradeApplied: true,
        rawEvents: [{ receivedAt: u.upgradedAt, status: 'finished', providerPaymentId: 'seed' }],
        createdAt: u.upgradedAt || u.createdAt,
        confirmedAt: u.upgradedAt,
      });
    }
  }
  // A handful of abandoned/failed checkouts among free users, for realism.
  const freeUsersForAbandoned = users.filter(u => u.tier === 'free').slice(0, 14);
  for (const u of freeUsersForAbandoned) {
    const pkg = pick(PKG_BY_PRICE);
    const status = pick(['waiting', 'expired', 'failed', 'partially_paid']);
    payments.push({
      id: Store.id('payments'),
      userId: u.id,
      packageCode: pkg.code,
      priceUSD: pkg.priceUSD,
      provider: 'nowpayments',
      status,
      providerPaymentId: status === 'waiting' ? null : String(randInt(5000000000, 5999999999)),
      providerInvoiceId: String(randInt(4000000000, 4999999999)),
      providerInvoiceUrl: null,
      payCurrency: pick(['btc', 'eth', 'usdttrc20']),
      actuallyPaid: status === 'partially_paid' ? Math.round(pkg.priceUSD * 0.4) : 0,
      upgradeApplied: false,
      rawEvents: [],
      createdAt: daysAgoISO(randInt(0, 20)),
      confirmedAt: null,
    });
  }
  await Store.replaceAll('payments', payments);

  console.log(`Seeded ${users.length} users, ${events.length} usage events, ${referrals.length} referrals, ${apiKeys.length} API keys, ${adminActions.length} admin actions, ${bonusEvents.length} bonus events, ${payments.length} payments.`);
  console.log(`Admin login -> username: admin / password: aig-admin-2026`);
}

seed().catch((err) => { console.error(err); process.exit(1); });
