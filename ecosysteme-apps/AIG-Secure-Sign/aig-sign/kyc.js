// ============================================================
// AIG Secure Sign — identity verification.
//
// WHAT THIS DELIBERATELY DOES NOT DO: store raw ID document images.
// Two real reasons, not one:
//   1. Security: storing scanned passports/licenses safely requires
//      encrypted-at-rest storage, strict access controls, and a real
//      security audit — infrastructure this static demo app doesn't
//      have and Claude's sandbox can't provide. Storing them insecurely
//      would be a genuine identity-theft risk to whoever uses this.
//   2. It wouldn't actually mean anything legally anyway. Storing a
//      photo of an ID does not constitute identity verification to any
//      recognized standard (eIDAS substantial/high assurance levels,
//      KYC/AML regimes, etc.) — those require liveness detection,
//      document authenticity checks, database cross-referencing, and
//      (for eIDAS QES specifically) a regulated identity-proofing
//      procedure performed by or on behalf of a Qualified Trust
//      Service Provider.
//
// WHAT THIS DOES INSTEAD: captures which two document types were
// provided and computes a SHA-256 hash of each file's bytes — enough
// to later prove "this exact file was the one uploaded at this time"
// without ever retaining the file itself — then discards the raw
// bytes from memory. The UI is explicit that this is NOT verified
// identity; it's an unverified self-declaration until a real vendor
// is connected.
//
// REAL INTEGRATION: to make this genuine identity verification, wire
// KYC_PROVIDER_CONFIG below to an actual licensed vendor's SDK/API —
// Persona, Onfido, Stripe Identity, or Jumio are the common choices.
// Each provides a client-side widget that handles document capture,
// liveness check, and authenticity verification themselves — your
// backend never touches the raw document either; the vendor does, and
// hands you back a verified/not-verified result plus a reference ID.
// That division of responsibility is the same reason platforms use a
// vendor for this instead of building it themselves.
// ============================================================

(function () {
  "use strict";

  const KYC_PROVIDER_CONFIG = {
    provider: "", // "persona" | "onfido" | "stripe_identity" | "jumio" | "" (none configured)
    apiBaseUrl: "", // your backend endpoint that creates a verification session with the vendor
    // Real integration shape (once configured), e.g. for Persona:
    //   1. Backend creates an "inquiry" via Persona's API, returns a client token.
    //   2. Frontend loads Persona's embeddable widget with that token — the widget
    //      itself handles camera capture, liveness check, and document upload,
    //      talking directly to Persona, never through your own servers.
    //   3. Persona webhooks your backend with the verified/failed result.
    //   4. Your backend updates the user's identityVerification status.
    // The specifics differ by vendor but the shape — vendor widget handles capture,
    // vendor's own infra handles the sensitive part, you only store the result — is
    // consistent across all of them and is why this file has a single config seam
    // rather than a vendor-specific implementation.
  };

  const DOCUMENT_TYPES = [
    { value: "passport", label: "Passport" },
    { value: "national_id", label: "National ID card" },
    { value: "drivers_license", label: "Driver's license" }
  ];

  async function hashAndDiscard(file) {
    const hash = await window.AIGSignCrypto.hashFile(file);
    return {
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      sha256: hash,
      uploadedAt: new Date().toISOString()
    };
    // `file` itself is never stored anywhere past this function returning —
    // no push to an array, no localStorage.setItem of the blob, nothing.
    // Only the small metadata object above is kept.
  }

  /**
   * Records that two ID documents were provided, in the honest,
   * hash-only way described above. This does NOT verify identity —
   * see isProviderConfigured() for whether real verification is wired up.
   */
  async function submitSelfDeclaredIdentity(email, file1, docType1, file2, docType2) {
    if (!file1 || !file2) throw new Error("Both documents are required.");
    if (docType1 === docType2) throw new Error("Please provide two different document types (e.g. passport + driver's license).");

    const meta1 = await hashAndDiscard(file1);
    const meta2 = await hashAndDiscard(file2);

    const record = {
      status: isProviderConfigured() ? "pending_provider_verification" : "self_declared_unverified",
      documents: [
        Object.assign({ type: docType1 }, meta1),
        Object.assign({ type: docType2 }, meta2)
      ],
      submittedAt: new Date().toISOString()
    };

    window.AIGSignAuth.updateUserRecord(email, { identityVerification: record });
    return record;
  }

  function isProviderConfigured() {
    return !!(KYC_PROVIDER_CONFIG.provider && KYC_PROVIDER_CONFIG.apiBaseUrl);
  }

  function statusLabel(identityVerification) {
    if (!identityVerification || identityVerification.status === "not_started") return "Not started";
    if (identityVerification.status === "self_declared_unverified") return "Documents provided \u2014 NOT independently verified";
    if (identityVerification.status === "pending_provider_verification") return "Verification in progress";
    if (identityVerification.status === "verified") return "Identity verified";
    if (identityVerification.status === "failed") return "Verification failed";
    return "Unknown";
  }

  window.AIGSignKYC = {
    KYC_PROVIDER_CONFIG,
    DOCUMENT_TYPES,
    submitSelfDeclaredIdentity,
    isProviderConfigured,
    statusLabel
  };
})();
