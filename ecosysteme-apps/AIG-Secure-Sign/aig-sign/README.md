# AIG Secure Sign

Document signing with a real, cryptographically-verifiable audit trail —
upload a PDF, place signature/date/text fields, send to one or more
signers, track who's viewed and signed in real time, and get a
completion certificate that anyone can independently verify wasn't
altered after the fact.

**Read this whole README before using this for anything with real legal
consequences.** The short version: the *engineering* here is real and
tested. Whether a signature produced by it is *legally enforceable* in
your jurisdiction is a separate question this README can't answer for
you — see "About compliance" below.

## Run it

No build step. From this folder:
```
python3 -m http.server 8000
```
Then open `http://localhost:8000`. Same `file://`-CORS restriction as
other AIG apps — must be served over HTTP.

**This demo's biggest honest limitation:** documents live in
`localStorage`, so a signing link only works within the *same browser*
that created the document (open it in a new tab, that's fine — a
different browser or device won't see it). Real cross-device signing
needs the backend in `backend-example/` — see that folder's README for
what connecting it actually requires (it's a genuine refactor, not a
one-line config change, because signing needs real network calls at
more points than a simpler app would).

## About compliance — the part that actually matters

Three different legal regimes, three different realities:

**ESIGN (US) / UETA** — there is no certification body or software
accreditation to obtain. It's a legal framework, not a technical
standard. Validity depends on: intent to sign, consent to electronic
records (with a specific required disclosure under ESIGN §101(c) — this
app's signer flow includes that disclosure, see the consent screen in
`sign.html`), the signature being logically tied to the record, and both
parties being able to retain/reproduce the record. **The real
"certification" here is a licensed attorney reviewing your actual
signing process end-to-end and issuing a legal opinion letter.** DocuSign
doesn't have a government ESIGN license either — they rely on process
design plus legal opinions.

**eIDAS (EU)** — this one has real formal tiers:
- *Simple* (SES): any indicated intent, no certification, weakest legal weight.
- *Advanced* (AdES): four technical criteria under Article 26 — unique
  link to signer, signer-identifying, created under the signer's sole
  control, tamper-evident linkage to the document. **This is what this
  app implements** — see "What's actually real here" below for exactly
  how. AdES does not legally require an accredited provider, but whether
  a specific implementation satisfies Article 26 in a way that holds up
  in court is still a legal determination.
- *Qualified* (QES) — legally equivalent to a handwritten signature
  automatically, EU-wide. **Requires** a certificate from an accredited
  Qualified Trust Service Provider (QTSP), audited by a national
  supervisory body. Becoming a QTSP is a multi-year regulatory
  accreditation — not achievable through app development. The realistic
  path to QES is integrating with an existing QTSP's API (Namirial,
  InfoCert, D-Trust, etc.) so they issue the qualified certificate per
  signature. This app does not do that; there's no vendor integration
  seam built for it because unlike the identity-verification piece,
  there wasn't a clear single API shape to build toward without knowing
  which QTSP you'd actually use.

**GDPR** — no universal certification exists (Article 42 schemes are
nascent/limited). Compliance is a legal/organizational program: lawful
basis for processing, DPAs with subprocessors, a DPIA (specifically
triggered here — you're handling identity documents and signed
contracts, both high-risk processing by definition), breach notification
procedures, often a DPO. **Validated by qualified privacy counsel, not
by code.**

## What's actually real here — the AdES pattern, specifically

Every signed document has a genuine cryptographic audit chain, not a
label:

1. The original PDF is SHA-256 hashed at upload.
2. Every meaningful action (uploaded, sent, consent given, signed,
   completed) becomes an audit event. Each event's hash is computed over
   *the previous event's hash plus this event's own data* — the same
   structural idea as a blockchain's hash chain, applied to one
   document's history.
3. Altering, inserting, or deleting any past event breaks every hash
   after it. `verifyAuditChain()` in `crypto-utils.js` recomputes the
   whole chain from scratch and will tell you exactly which event
   doesn't check out.
4. The completion certificate embeds the full chain, so verification
   doesn't require trusting this app at all — anyone can recompute the
   same SHA-256 hashes themselves.

**I tested that this actually catches tampering, not just that the
crypto module runs.** After a real document was fully signed, I directly
edited its record in `localStorage` — simulating someone with database
access altering history after the fact — and confirmed both the app's
own detail view *and* the independently-loaded certificate page both
correctly flagged exactly which event was altered. See "Tested" below.

## Identity verification — the honest version of "store 2 IDs"

Deliberately does **not** store raw ID document images. Two separate
reasons:

1. **Security.** Storing scanned passports/licenses safely requires
   encrypted-at-rest storage, strict access controls, and a real
   security audit. This static demo has none of that infrastructure, and
   storing them insecurely would be a genuine identity-theft risk.
2. **It wouldn't mean anything legally anyway.** A photo of an ID isn't
   verified identity under any recognized standard. Real verification
   needs liveness detection, document authenticity checks, and (for
   eIDAS QES specifically) a regulated identity-proofing procedure.

**What actually happens**: uploading two documents computes a SHA-256
hash of each file's bytes and records `{type, fileName, mimeType,
sizeBytes, sha256}` — then the raw file is discarded from memory. I
verified directly that this holds: after submitting two documents, I
searched the entirety of `localStorage` for the raw PDF file signature
("%PDF") and confirmed it does not appear anywhere — only ~800 bytes of
metadata for both documents combined. The status shown is honestly
labeled "Documents provided — NOT independently verified," never a fake
"Verified ✓."

**To make this genuine identity verification**: `kyc.js` has a single
`KYC_PROVIDER_CONFIG` seam, documented with the real integration shape,
for connecting Persona, Onfido, Stripe Identity, or Jumio — real licensed
vendors whose own widgets handle document capture and liveness checking
directly, never routing the sensitive part through your own servers.

## Tested

**Full signing workflow, end to end** (register → upload PDF → place
fields → assign to signer → send → open link in a separate browser tab
as the signer → consent → fill fields → sign → completion → dashboard
status updates → audit trail → certificate) — every step confirmed
working with zero console errors on either the sender or signer side.

**Tamper detection on a real completed document** — not just the
isolated crypto module: directly edited a signed document's audit event
in `localStorage` after completion, confirmed both the in-app "Verify
audit trail integrity" button and the independently-loaded certificate
page correctly detected it and identified the exact event that was
altered.

**Identity verification** — confirmed the same-document-type rejection
works, confirmed successful submission with two different types, and
directly searched all of `localStorage` after submission to confirm no
raw file bytes were persisted anywhere (only hash + metadata).

**Mobile** (390px touch viewport) — auth, dashboard, and the 3-column
editor all render with zero horizontal overflow. The signer's experience
— consent, field-filling, and especially the **signature pad** — was
tested with real `Touch`/`TouchEvent` construction (not just a mouse
simulation) and correctly captures a drawn signature.

**Found and fixed two real bugs:**

1. Three emoji in the field palette and the signer's success screen were
   written as literal JS-style unicode escape text (`\u270D\ufe0f`)
   instead of actual characters, so they displayed as garbled text
   instead of rendering as emoji. Fixed by replacing with the real
   characters, and searched the rest of the codebase to confirm no other
   instances existed.
2. **More significant**: the sender's field-placement editor used only
   native HTML5 drag-and-drop (`draggable` + `dragstart`/`drop`), which
   does not fire from touch gestures on mobile browsers — this is
   standard, well-documented browser behavior, not a one-off quirk. My
   first mobile test appeared to pass only because it used
   `page.evaluate()` to directly dispatch a synthetic `DragEvent`,
   bypassing the real touch-to-drag translation a finger would need.
   Caught this by specifically testing with real `Touch`/`TouchEvent`
   construction instead, confirmed it genuinely failed (0 fields placed),
   and fixed it by adding a parallel touch-tracking path (touch start on
   a palette item → follow the finger with a ghost indicator → check on
   release whether it's over the canvas) that funnels into the same
   `placeField()` function the mouse path uses. Re-verified with real
   touch events afterward — now places fields correctly.

**Not tested, and why:** actual PDF rendering via pdf.js. This sandbox
blocks `unpkg.com` (same restriction that affected Leaflet in the AIG
Business Weather app), so I could not verify the real PDF.js library
loading and rendering a real PDF page. I confirmed the *failure path*
degrades correctly (a clear, specific error message rather than a silent
break), and tested everything downstream of PDF rendering — field
placement, signing, audit trail, certificate — using a mock that
implements pdf.js's exact API shape but draws a placeholder rectangle
instead of real PDF content. `unpkg.com` is a real, extremely widely used
CDN (same one this app family already relies on for Leaflet); a user
with normal internet access should not hit this, but I have not
personally seen this app render a real PDF page.

## Files

```
index.html, app.js        sender app: auth, dashboard, PDF upload +
                            drag-and-drop field editor, send flow,
                            document detail/tracking, identity verification UI
sign.html, sign.js         signer experience: consent/disclosure, PDF +
                            fillable fields, signature pad (draw or type,
                            mouse and touch), completion
certificate.html,          the actual deliverable: renders the full audit
  certificate.js            chain and independently re-verifies its integrity
crypto-utils.js            SHA-256 hashing + the hash-chain audit-trail
                            implementation — shared by all pages
auth.js                    account system (local stand-in, same pattern
                            as the other AIG apps — see its own comments)
kyc.js                     identity verification — hash-only, no raw
                            storage, documented real-vendor integration seam
styles.css                 shared styling
backend-example/            real reference backend solving cross-device
                            signing + server-captured IP — see its own README
```
