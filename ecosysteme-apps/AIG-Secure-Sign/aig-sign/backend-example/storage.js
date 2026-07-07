// ============================================================
// Storage — flat JSON file, same honest-limitations pattern as the
// other AIG backend examples (see AIG Business Weather's
// backend-example/storage.js for the fuller explanation). Fine for
// trying this out; not fine for real traffic — no concurrent-write
// safety, full-file rewrite on every change, no indexing.
//
// For real use, replace these three functions with real database
// calls (Postgres, etc.) and, importantly, move PDF storage OUT of
// this JSON blob entirely into real object storage (S3-compatible) —
// storing base64-encoded file contents inline in a JSON document
// works for a demo but doesn't scale and makes the "database" balloon
// fast. Keep the field as a URL/reference instead once you do this.
// ============================================================

const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "documents.json");

function readAll() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
  catch (e) { return []; }
}
function writeAll(docs) { fs.writeFileSync(DB_FILE, JSON.stringify(docs, null, 2)); }

async function upsertDocument(doc) {
  const docs = readAll();
  const idx = docs.findIndex(d => d.id === doc.id);
  if (idx >= 0) docs[idx] = doc; else docs.push(doc);
  writeAll(docs);
}
async function getDocument(id) { return readAll().find(d => d.id === id) || null; }
async function getDocumentsByOwner(email) { return readAll().filter(d => d.ownerEmail === email); }
function count() { return readAll().length; }

module.exports = { upsertDocument, getDocument, getDocumentsByOwner, count };
