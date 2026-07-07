// ============================================================
// AIG Secure Sign — completion certificate.
//
// This is the actual deliverable: a self-contained record of who
// signed what, when, and the full cryptographic audit chain so anyone
// (not just this app) can independently verify nothing was altered
// after the fact — that's the real substance behind "tamper-proof",
// not just a label.
// ============================================================

(function () {
  "use strict";

  const DOCS_KEY = "aigsign_documents_v1";
  const params = new URLSearchParams(location.search);
  const docId = params.get("doc");

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function loadAllDocuments() {
    try { return JSON.parse(localStorage.getItem(DOCS_KEY) || "[]"); }
    catch (e) { return []; }
  }

  async function render() {
    const doc = loadAllDocuments().find(d => d.id === docId);
    const loadingEl = document.getElementById("loadingState");
    const errorEl = document.getElementById("errorState");
    const contentEl = document.getElementById("certContent");

    if (!doc) {
      loadingEl.style.display = "none";
      errorEl.style.display = "block";
      errorEl.innerHTML = "<b>Certificate not found.</b> This document either doesn't exist or isn't accessible from this browser.";
      return;
    }
    if (doc.status !== "completed") {
      loadingEl.style.display = "none";
      errorEl.style.display = "block";
      errorEl.innerHTML = "<b>Not yet complete.</b> A completion certificate is only available once every signer has signed. Current status: " + escapeHtml(doc.status.replace("_", " ")) + ".";
      return;
    }

    const chainResult = await window.AIGSignCrypto.verifyAuditChain(doc.auditChain);

    contentEl.innerHTML = `
      <div class="cert-header">
        <div><span class="dot"></span><b>Certificate of Completion</b></div>
        <div class="cert-title">${escapeHtml(doc.title || "Untitled document")}</div>
        <div class="cert-doc-hash">Original document SHA-256: ${escapeHtml(doc.fileHash)}</div>
        <div style="font-size:11.5px; color:var(--text-faint); margin-top:6px;">Completed ${new Date(doc.completedAt).toLocaleString()}</div>
      </div>

      <div class="disclaimer-banner">
        <b>What this certificate does and doesn't prove.</b> The audit chain below is cryptographically
        verifiable — anyone can recompute the hashes and confirm this exact record wasn't altered after
        the fact (see the integrity check at the bottom). What it does <i>not</i> do on its own is make a
        legal determination that this signature is enforceable in any specific jurisdiction — that
        depends on applicable law and, for the highest eIDAS tier specifically, on whether a Qualified
        Trust Service Provider issued the signing certificate. See the main app's "About compliance"
        section.
      </div>

      <div class="cert-section">
        <div class="cert-section-title">Signers</div>
        ${doc.signers.map((s, i) => {
          const sigFields = doc.fields.filter(f => f.assignedSignerId === s.id && f.type === "signature" && f.value);
          const sigImg = sigFields.length ? sigFields[0].value : null;
          return `
            <div class="signer-cert-card">
              ${sigImg ? `<img class="signer-cert-sig-img" src="${sigImg}" alt="Signature">` : ""}
              <div class="signer-cert-meta">
                <b>${escapeHtml(s.name)}</b><br>
                ${escapeHtml(s.email)}<br>
                Signed: ${s.signedAt ? new Date(s.signedAt).toLocaleString() : "\u2014"}<br>
                Consent given: ${s.consentGivenAt ? new Date(s.consentGivenAt).toLocaleString() : "\u2014"}<br>
                IP address: ${escapeHtml(s.ipNote || "not captured (best-effort client-side lookup unavailable \u2014 a real backend should capture this from the HTTP request instead)")}
              </div>
            </div>`;
        }).join("")}
      </div>

      <div class="cert-section">
        <div class="cert-section-title">Full audit trail (${doc.auditChain.length} events)</div>
        <div style="overflow-x:auto;">
          <table class="audit-table">
            <tr><th>#</th><th>Action</th><th>Actor</th><th>Timestamp</th><th>Event hash</th></tr>
            ${doc.auditChain.map(ev => `
              <tr>
                <td>${ev.sequence}</td>
                <td>${escapeHtml(ev.action.replace(/_/g, " "))}</td>
                <td>${escapeHtml(ev.actor || "\u2014")}</td>
                <td>${new Date(ev.timestamp).toLocaleString()}</td>
                <td><span class="hash-chip">${ev.hash}</span></td>
              </tr>`).join("")}
          </table>
        </div>
        <div class="chain-integrity-box ${chainResult.valid ? "valid" : "invalid"}">
          ${chainResult.valid
            ? "\u2713 Integrity check passed \u2014 every event hash was independently recomputed from this certificate's own data and matches exactly. This record has not been altered since it was created."
            : "\u2717 Integrity check FAILED at event #" + chainResult.brokenAtIndex + " \u2014 this audit trail does not verify. Do not rely on this certificate."}
        </div>
      </div>
    `;

    loadingEl.style.display = "none";
    contentEl.style.display = "block";
  }

  render();
})();
