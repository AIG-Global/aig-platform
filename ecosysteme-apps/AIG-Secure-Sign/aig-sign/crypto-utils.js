// ============================================================
// AIG Secure Sign — crypto & audit-chain utilities.
//
// This file implements the actual tamper-evidence pattern real
// e-signature platforms use, not a placeholder:
//   1. Every document is hashed (SHA-256) at every meaningful state
//      change (uploaded, sent, each field filled, each signature).
//   2. Every audit event is chained to the previous one (each event's
//      hash includes the previous event's hash), so altering or
//      deleting a past event changes every hash after it — the same
//      structural idea as a blockchain's hash chain, applied to one
//      document's audit trail rather than a distributed ledger.
//   3. The final completion certificate embeds the full chain, so
//      anyone can independently recompute it and confirm nothing was
//      altered after the fact.
//
// IMPORTANT — what this is and isn't:
// This satisfies the SPIRIT of eIDAS Article 26(d) — "linked to the
// signed data in such a way that any subsequent change... is
// detectable" — using real, correct cryptography (Web Crypto API's
// native SHA-256, not a toy hash). But whether this specific
// implementation legally qualifies as an Advanced Electronic Signature
// in any given jurisdiction is a legal determination, not a code
// property — see the main README for what that actually requires.
// ============================================================

(function () {
  "use strict";

  async function sha256Hex(input) {
    const data = typeof input === "string" ? new TextEncoder().encode(input) : input;
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function hashFile(file) {
    const buffer = await file.arrayBuffer();
    return sha256Hex(buffer);
  }

  /**
   * Builds the next link in an audit chain. Each event's hash is
   * computed over (previousHash + canonical JSON of this event's own
   * fields), so the chain is only valid if computed in order and
   * nothing in between was altered.
   */
  async function appendAuditEvent(chain, event) {
    const previousHash = chain.length ? chain[chain.length - 1].hash : "0".repeat(64); // genesis link
    const eventWithMeta = Object.assign({}, event, {
      sequence: chain.length,
      previousHash,
      timestamp: new Date().toISOString()
    });
    const canonical = JSON.stringify(eventWithMeta, Object.keys(eventWithMeta).sort());
    const hash = await sha256Hex(canonical);
    const link = Object.assign({}, eventWithMeta, { hash });
    chain.push(link);
    return link;
  }

  /**
   * Recomputes every hash in a chain from scratch and compares against
   * the stored hashes. Returns {valid, brokenAtIndex} — brokenAtIndex
   * is null if the whole chain checks out, or the index of the first
   * link that doesn't match if something was altered.
   */
  async function verifyAuditChain(chain) {
    let previousHash = "0".repeat(64);
    for (let i = 0; i < chain.length; i++) {
      const link = chain[i];
      const { hash, ...rest } = link;
      if (rest.previousHash !== previousHash) return { valid: false, brokenAtIndex: i };
      const canonical = JSON.stringify(rest, Object.keys(rest).sort());
      const recomputed = await sha256Hex(canonical);
      if (recomputed !== hash) return { valid: false, brokenAtIndex: i };
      previousHash = hash;
    }
    return { valid: true, brokenAtIndex: null };
  }

  window.AIGSignCrypto = { sha256Hex, hashFile, appendAuditEvent, verifyAuditChain };
})();
