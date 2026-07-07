// ============================================================
// AIG Secure Sign — backend example.
//
// What this actually solves: the frontend-only demo stores documents
// in localStorage, which only one browser can see — a signing link
// opened on the SIGNER's own phone/laptop can't find a document that
// only exists in the SENDER's browser. This backend is genuinely
// shared server-side storage, so any party's device can reach the
// same document.
//
// What this does NOT solve on its own: legal compliance. See the main
// README's "About compliance" section — nothing here changes that.
//
// Document shape stored here is identical to what the frontend already
// builds client-side (same fields/signers/auditChain structure) — this
// backend is a shared store for that shape, not a redesign of it.
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const storage = require("./storage");

const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" })); // documents include base64 PDFs; raise the body limit accordingly

const PORT = process.env.PORT || 3002;

// ============================================================
// Documents — same shape the frontend already uses.
// ============================================================
app.post("/api/documents", async (req, res) => {
  const doc = req.body;
  if (!doc || !doc.id || !doc.ownerEmail) return res.status(400).json({ error: "Document must include at least {id, ownerEmail}." });
  await storage.upsertDocument(doc);
  res.json({ ok: true });
});

app.get("/api/documents/:id", async (req, res) => {
  const doc = await storage.getDocument(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found." });
  res.json(doc);
});

app.get("/api/documents", async (req, res) => {
  const owner = req.query.owner;
  if (!owner) return res.status(400).json({ error: "Provide ?owner=<email>." });
  const docs = await storage.getDocumentsByOwner(owner);
  res.json(docs);
});

// ============================================================
// Server-timestamped audit events with REAL captured IP.
//
// This is a genuine improvement over the client-only demo: the client
// can't reliably learn a signer's real IP (the frontend's best-effort
// ipify lookup reveals it to a THIRD PARTY and can fail/be blocked).
// The server sees the actual request IP directly from the connection —
// this is the standard, reliable way real e-signature platforms capture
// this for the audit trail.
// ============================================================
app.post("/api/documents/:id/audit-event", async (req, res) => {
  const doc = await storage.getDocument(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found." });

  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
  const event = Object.assign({}, req.body, { serverCapturedIp: clientIp, serverTimestamp: new Date().toISOString() });

  doc.auditChain = doc.auditChain || [];
  doc.auditChain.push(event);
  await storage.upsertDocument(doc);
  res.json({ ok: true, capturedIp: clientIp });
});

app.get("/api/health", (req, res) => res.json({ ok: true, documentCount: storage.count() }));

app.listen(PORT, () => {
  console.log("AIG Secure Sign backend listening on port " + PORT);
});
