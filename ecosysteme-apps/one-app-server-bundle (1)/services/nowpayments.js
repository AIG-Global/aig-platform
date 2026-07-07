// ============================================================
// services/nowpayments.js — Thin HTTP client for the NOWPayments
// crypto payment API (https://nowpayments.io).
//
// No external HTTP library (no axios/node-fetch) — built on
// Node's https module, consistent with the rest of this backend's
// zero-dependency approach.
//
// Docs referenced:
//   - POST /v1/invoice        create a hosted checkout invoice
//   - GET  /v1/payment/:id    check a payment's status
//   - GET  /v1/status         API health check
//   - IPN signature: sort body keys alphabetically, JSON.stringify,
//     HMAC-SHA512 with the IPN secret, compare to x-nowpayments-sig
// ============================================================

const https = require('https');
const crypto = require('crypto');

const API_HOST = 'api.nowpayments.io';
const API_KEY = process.env.NOWPAYMENTS_API_KEY || '';
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET || '';
// Sandbox lets you exercise the whole flow without a live merchant account.
const USE_SANDBOX = process.env.NOWPAYMENTS_SANDBOX === 'true';
const SANDBOX_HOST = 'api-sandbox.nowpayments.io';

function isConfigured() {
  return Boolean(API_KEY);
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const host = USE_SANDBOX ? SANDBOX_HOST : API_HOST;
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        host,
        path,
        method,
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
        timeout: 15000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try { parsed = data ? JSON.parse(data) : {}; } catch { parsed = { raw: data }; }
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed?.message || `NOWPayments API error (${res.statusCode})`));
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('NOWPayments request timed out')); });
    if (payload) req.write(payload);
    req.end();
  });
}

const NowPayments = {
  isConfigured,

  /** Basic connectivity/API-key sanity check. */
  async status() {
    if (!isConfigured()) return { message: 'not_configured' };
    return request('GET', '/v1/status');
  },

  /**
   * Create a hosted checkout invoice. The customer is redirected to
   * invoice_url to pay in whatever crypto they choose; NOWPayments
   * converts/settles to the merchant's configured payout currency.
   *
   * priceAmount/priceCurrency = the fiat price you're charging
   * (e.g. 399 EUR for Package A). orderId should be our own
   * payments record id so the IPN callback can be matched back to it.
   */
  async createInvoice({ priceAmount, priceCurrency, orderId, orderDescription, ipnCallbackUrl, successUrl, cancelUrl }) {
    if (!isConfigured()) {
      throw new Error('NOWPayments is not configured (missing NOWPAYMENTS_API_KEY)');
    }
    return request('POST', '/v1/invoice', {
      price_amount: priceAmount,
      price_currency: priceCurrency,
      order_id: orderId,
      order_description: orderDescription,
      ipn_callback_url: ipnCallbackUrl,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  },

  /** Look up a payment's current status directly from NOWPayments (fallback if a webhook is missed). */
  async getPaymentStatus(paymentId) {
    if (!isConfigured()) throw new Error('NOWPayments is not configured');
    return request('GET', `/v1/payment/${paymentId}`);
  },

  /**
   * Verify an inbound IPN webhook's signature.
   * NOWPayments signs the JSON body (keys sorted alphabetically,
   * recursively) with HMAC-SHA512 using the IPN secret, and sends
   * the hex digest in the x-nowpayments-sig header.
   */
  verifyIpnSignature(rawBody, signatureHeader) {
    if (!IPN_SECRET) return { valid: false, reason: 'IPN secret not configured' };
    if (!signatureHeader) return { valid: false, reason: 'Missing x-nowpayments-sig header' };

    let parsed;
    try { parsed = JSON.parse(rawBody); } catch { return { valid: false, reason: 'Body is not valid JSON' }; }

    const sortedString = sortedJsonString(parsed);
    const expected = crypto.createHmac('sha512', IPN_SECRET).update(sortedString).digest('hex');

    const valid = timingSafeEqualHex(expected, signatureHeader);
    return { valid, reason: valid ? null : 'Signature mismatch', payload: parsed };
  },
};

/** Recursively sort object keys, matching NOWPayments' signing scheme. */
function sortedJsonString(value) {
  if (Array.isArray(value)) {
    return '[' + value.map(sortedJsonString).join(',') + ']';
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return '{' + keys.map((k) => JSON.stringify(k) + ':' + sortedJsonString(value[k])).join(',') + '}';
  }
  return JSON.stringify(value);
}

function timingSafeEqualHex(a, b) {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  try { return crypto.timingSafeEqual(bufA, bufB); } catch { return false; }
}

module.exports = NowPayments;
