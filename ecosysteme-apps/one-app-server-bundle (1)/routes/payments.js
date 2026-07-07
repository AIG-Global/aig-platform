// ============================================================
// routes/payments.js — NOWPayments integration routes.
// ============================================================

const Payments = require('../services/payments');
const NowPayments = require('../services/nowpayments');
const Store = require('../lib/store');
const { requireAdmin, requireApiKey } = require('../middleware/auth');
const { rateLimit } = require('../lib/rateLimit');

// The webhook has no API key (NOWPayments can't supply one), so its
// only gatekeeping is the HMAC signature — but signature checks alone
// don't stop someone from hammering the endpoint with garbage to
// consume CPU/log volume. Layer a generous-but-real rate limit on
// top; legitimate NOWPayments traffic for one merchant account is
// nowhere near this volume.
const webhookRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Webhook rate limit exceeded.',
});

const createPaymentRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Too many payment attempts — please try again later.',
});

function register(router) {
  // ---------------- Public-ish API (API key) ----------------
  router.post('/api/v1/payments/create', createPaymentRateLimit, requireApiKey('events:write'), async (req, res) => {
    const { userId, packageCode } = req.body;
    if (!userId || !packageCode) return res.fail(400, 'userId and packageCode are required');

    const baseUrl = (process.env.PUBLIC_BASE_URL || `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`).replace(/\/$/, '');

    try {
      const { payment, configured } = await Payments.createUpgradePayment({ userId, packageCode, baseUrl });
      res.json({
        ok: true,
        configured,
        payment: {
          id: payment.id,
          status: payment.status,
          priceUSD: payment.priceUSD,
          packageCode: payment.packageCode,
          invoiceUrl: payment.providerInvoiceUrl,
        },
        ...(configured ? {} : { hint: 'NOWPayments API key not set on the server — this is a placeholder payment record for demo/testing.' }),
      });
    } catch (err) {
      res.fail(400, err.message);
    }
  });

  router.get('/api/v1/payments/:id/status', requireApiKey('analytics:read'), async (req, res) => {
    const payment = Payments.get(req.params.id);
    if (!payment) return res.fail(404, 'Payment not found');

    if (NowPayments.isConfigured() && payment.providerPaymentId) {
      try {
        const live = await NowPayments.getPaymentStatus(payment.providerPaymentId);
        if (live && live.payment_status) {
          await Payments.applyProviderEvent(live);
        }
      } catch (e) {
        // Non-fatal — fall back to whatever we have locally.
      }
    }
    const fresh = Payments.get(req.params.id);
    res.json({
      id: fresh.id, status: fresh.status, packageCode: fresh.packageCode,
      priceUSD: fresh.priceUSD, upgradeApplied: !!fresh.upgradeApplied,
    });
  });

  router.get('/api/v1/payments/packages', requireApiKey('analytics:read'), (req, res) => {
    res.json(Object.values(Payments.PACKAGES));
  });

  // ---------------- IPN webhook (NOWPayments calls this directly) ----------------
  router.post('/api/webhooks/nowpayments', webhookRateLimit, async (req, res) => {
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-nowpayments-sig'];

    const verification = NowPayments.verifyIpnSignature(rawBody, signature);
    if (!verification.valid) {
      // Logged in detail server-side for debugging a real integration
      // issue; the response itself stays generic so a probing attacker
      // doesn't learn *why* their forged signature failed.
      console.warn('[nowpayments webhook] rejected:', verification.reason, 'from', req.socket?.remoteAddress);
      return res.fail(401, 'Invalid signature');
    }

    try {
      const record = await Payments.applyProviderEvent(req.body);
      res.json({ ok: true, paymentId: record.id, status: record.status });
    } catch (err) {
      console.error('[nowpayments webhook] processing error:', err.message);
      res.fail(400, 'Unable to process this event');
    }
  });

  // ---------------- Admin visibility ----------------
  router.get('/api/admin/payments/config', requireAdmin, (req, res) => {
    res.json({
      configured: NowPayments.isConfigured(),
      sandbox: process.env.NOWPAYMENTS_SANDBOX === 'true',
      ipnConfigured: Boolean(process.env.NOWPAYMENTS_IPN_SECRET),
    });
  });

  router.get('/api/admin/payments', requireAdmin, (req, res) => {
    const { status, userId } = req.query;
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const result = Payments.list({ status, userId, limit, offset });

    const users = Store.all('users');
    const enriched = result.payments.map((p) => ({
      ...p,
      userName: users.find((u) => u.id === p.userId)?.name || null,
    }));
    res.json({ total: result.total, payments: enriched });
  });
}

module.exports = { register };
