// ============================================================
// services/payments.js — Payment lifecycle for account-level
// upgrades via NOWPayments.
//
// IMPORTANT distinction (mirrors services/users.js):
// A confirmed NOWPayments payment is real revenue moving through
// the network, so it must go through Users.normalUpgrade() —
// i.e. it DOES generate the AIG network bonus. This is the
// "future account level upgrade" path the product/business logic
// expects: pay -> upgrade -> sponsor + network pool get credited.
//
// This is distinct from Users.adminOverrideUpgrade(), which
// remains the only no-bonus path and stays admin-only.
// ============================================================

const Store = require('../lib/store');
const Users = require('./users');
const NowPayments = require('./nowpayments');

// Package price list — matches the AIG membership tiers described
// in the product. Stored here (not hardcoded in routes) so pricing
// changes happen in one place.
const PACKAGES = {
  A: { code: 'A', label: 'Package A', priceUSD: 399 },
  B: { code: 'B', label: 'Package B', priceUSD: 699 },
  C: { code: 'C', label: 'Package C', priceUSD: 1099 },
  PROFESSIONAL: { code: 'PROFESSIONAL', label: 'Professional Package', priceUSD: 2999 },
};

function getPackage(code) {
  const pkg = PACKAGES[String(code || '').toUpperCase()];
  if (!pkg) throw new Error(`Unknown package code "${code}". Valid: ${Object.keys(PACKAGES).join(', ')}`);
  return pkg;
}

const Payments = {
  PACKAGES,
  getPackage,

  list({ status, userId, limit = 50, offset = 0 } = {}) {
    let rows = Store.all('payments');
    if (status) rows = rows.filter((p) => p.status === status);
    if (userId) rows = rows.filter((p) => p.userId === userId);
    rows = rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { total: rows.length, payments: rows.slice(offset, offset + limit) };
  },

  get(paymentId) {
    return Store.get('payments', paymentId);
  },

  findByOrderId(orderId) {
    return Store.findOne('payments', (p) => p.id === orderId);
  },

  findByProviderPaymentId(providerPaymentId) {
    return Store.findOne('payments', (p) => p.providerPaymentId === String(providerPaymentId));
  },

  async createUpgradePayment({ userId, packageCode, baseUrl }) {
    const user = Users.get(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'paid') throw new Error('User is already paid');

    const pkg = getPackage(packageCode);

    const record = await Store.insert('payments', {
      userId,
      packageCode: pkg.code,
      priceUSD: pkg.priceUSD,
      provider: 'nowpayments',
      status: 'pending',
      providerPaymentId: null,
      providerInvoiceUrl: null,
      rawEvents: [],
    });

    if (!NowPayments.isConfigured()) {
      const stub = await Store.update('payments', record.id, {
        status: 'pending',
        providerInvoiceUrl: null,
        note: 'NOWPayments not configured — set NOWPAYMENTS_API_KEY to enable real checkout.',
      });
      return { payment: stub, configured: false };
    }

    try {
      const invoice = await NowPayments.createInvoice({
        priceAmount: pkg.priceUSD,
        priceCurrency: 'usd',
        orderId: record.id,
        orderDescription: `ONE / AIG — ${pkg.label} upgrade`,
        ipnCallbackUrl: `${baseUrl}/api/webhooks/nowpayments`,
        successUrl: `${baseUrl}/payment-success?order=${record.id}`,
        cancelUrl: `${baseUrl}/payment-cancelled?order=${record.id}`,
      });

      const updated = await Store.update('payments', record.id, {
        status: 'waiting',
        providerInvoiceId: invoice.id || null,
        providerInvoiceUrl: invoice.invoice_url || null,
      });
      return { payment: updated, configured: true };
    } catch (err) {
      const failed = await Store.update('payments', record.id, { status: 'failed', note: err.message });
      throw Object.assign(new Error(err.message), { payment: failed });
    }
  },

  /**
   * Apply an inbound IPN event to the matching local payment record,
   * and — if this event represents final confirmation — perform the
   * real, bonus-generating account upgrade exactly once.
   *
   * Idempotent and order-aware: safe to call multiple times for the
   * same payment (NOWPayments retries IPNs), will not double-upgrade
   * a user, and will not let a stale/out-of-order event resurrect a
   * payment that has already reached a terminal failure state.
   */
  async applyProviderEvent(event) {
    const orderId = event.order_id;
    const providerPaymentId = String(event.payment_id || '');
    const status = String(event.payment_status || '').toLowerCase();

    let record = orderId ? this.findByOrderId(orderId) : null;
    if (!record && providerPaymentId) record = this.findByProviderPaymentId(providerPaymentId);
    if (!record) {
      throw new Error(`No local payment found for order_id=${orderId} payment_id=${providerPaymentId}`);
    }

    // Terminal states never move again. Without this guard, a
    // delayed/duplicated/out-of-order webhook (NOWPayments explicitly
    // documents that it retries) could resurrect a payment we already
    // closed out as failed/expired/refunded and push it to confirmed.
    const TERMINAL_STATES = ['confirmed', 'failed', 'refunded', 'expired'];
    if (TERMINAL_STATES.includes(record.status) && record.status !== mapProviderStatus(status)) {
      const rawEvents = Array.isArray(record.rawEvents) ? record.rawEvents.slice(-19) : [];
      rawEvents.push({ receivedAt: Store.nowISO(), status, providerPaymentId, ignored: true, reason: 'payment already in terminal state' });
      return Store.update('payments', record.id, { rawEvents });
    }

    // Sanity-check the paid amount against what we actually invoiced.
    // The HMAC signature already proves the body came from NOWPayments
    // unmodified, but this catches a different class of problem: a
    // provider-side bug, a stale cached response, or a payment that
    // was only ever partially funded somehow reporting "finished".
    // We never trust amount data enough to upgrade on underpayment.
    const actuallyPaid = Number(event.actually_paid ?? 0);
    const isFinalConfirmation = ['finished', 'confirmed'].includes(status);
    const UNDERPAYMENT_TOLERANCE = 0.98; // allow for minor exchange-rate slippage NOWPayments itself tolerates
    if (isFinalConfirmation && record.priceUSD && actuallyPaid > 0 && actuallyPaid < record.priceUSD * UNDERPAYMENT_TOLERANCE) {
      const rawEvents = Array.isArray(record.rawEvents) ? record.rawEvents.slice(-19) : [];
      rawEvents.push({ receivedAt: Store.nowISO(), status, providerPaymentId, ignored: true, reason: `underpaid: ${actuallyPaid} < expected ${record.priceUSD}` });
      console.warn(`[payments] order ${record.id} reported ${status} but actually_paid (${actuallyPaid}) is below expected (${record.priceUSD}) — not upgrading`);
      return Store.update('payments', record.id, { status: 'partially_paid', actuallyPaid, rawEvents });
    }

    const rawEvents = Array.isArray(record.rawEvents) ? record.rawEvents.slice(-19) : [];
    rawEvents.push({ receivedAt: Store.nowISO(), status, providerPaymentId });

    record = await Store.update('payments', record.id, {
      status: mapProviderStatus(status),
      providerPaymentId: providerPaymentId || record.providerPaymentId,
      actuallyPaid: event.actually_paid ?? record.actuallyPaid,
      payCurrency: event.pay_currency || record.payCurrency,
      rawEvents,
    });

    if (isFinalConfirmation && !record.upgradeApplied) {
      const user = Users.get(record.userId);
      if (user && user.tier !== 'paid') {
        await Users.normalUpgrade(record.userId); // real revenue -> bonus IS generated
      }
      record = await Store.update('payments', record.id, { upgradeApplied: true, confirmedAt: Store.nowISO() });
    }

    return record;
  },
};

function mapProviderStatus(providerStatus) {
  const map = {
    waiting: 'waiting',
    confirming: 'confirming',
    confirmed: 'confirming',
    sending: 'confirming',
    partially_paid: 'partially_paid',
    finished: 'confirmed',
    failed: 'failed',
    refunded: 'refunded',
    expired: 'expired',
  };
  return map[providerStatus] || providerStatus || 'pending';
}

module.exports = Payments;
