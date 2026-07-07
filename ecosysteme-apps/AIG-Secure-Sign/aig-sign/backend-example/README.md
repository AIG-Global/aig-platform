# AIG Secure Sign — backend example

Solves one specific, real limitation of the frontend-only demo: documents
live in `localStorage`, so a signing link only works within the same
browser that created it. This backend is genuinely shared storage — the
sender's laptop and the signer's phone can both reach the same document.

**Honesty check on "runnable":** written and syntax-checked carefully, and
the storage logic (`storage.js`) is unit-tested directly (see the test in
this file's history / re-run it yourself: create/read/list-by-owner/update
all verified). What I could **not** do is actually run the Express server
end-to-end — no npm registry access in the sandbox this was built in. Test
it yourself before depending on it.

## What this adds beyond the frontend-only demo

1. **Cross-device signing** — the actual point of this backend. `POST
   /api/documents` saves a document (same JSON shape the frontend already
   builds), `GET /api/documents/:id` lets any device fetch it.
2. **Real server-captured IP addresses** — `POST
   /api/documents/:id/audit-event` reads the actual request IP from
   `req.socket.remoteAddress` / `X-Forwarded-For`. This is a genuine
   improvement over the frontend-only demo, which can only do a
   best-effort client-side lookup (via a third-party service, ipify) that
   reveals the signer's IP to that third party and can fail or be blocked.
   Server-side capture from the real HTTP request is the standard,
   reliable approach real e-signature platforms use.

## Setup

```bash
cd backend-example
npm install
cp .env.example .env
npm start
```

## Connecting the frontend

The frontend currently reads/writes documents directly to `localStorage`
(see the big comment at the top of `app.js`). To use this backend instead,
the integration points are:

- Wherever `app.js` calls `upsertDocument(doc)` → `POST` that same object
  to `/api/documents` instead.
- Wherever `app.js`/`sign.js` call `getDocument(id)` → `GET
  /api/documents/:id` instead.
- Wherever `crypto-utils.js`'s `appendAuditEvent` is called and then the
  doc is persisted → also `POST` the new event to
  `/api/documents/:id/audit-event` so the server can attach the real
  captured IP.

This is a genuine refactor (swapping synchronous localStorage calls for
async fetch calls throughout), not a one-line config change like some of
the other AIG apps' backend seams — document signing inherently needs
real network calls at more points than, say, a weather app's optional
push notifications.

## Deploying this for real

Same considerations as the other AIG backend examples: needs continuous
hosting (a VPS, Railway, Render, Fly.io — not serverless as-is, since
there's no scheduled/triggered work here, just a normal always-on API),
real HTTPS, and — given this is now the actual storage location for
signed contracts and their audit trails — genuinely serious operational
requirements: encrypted-at-rest storage, backups, access controls, and
everything else "About compliance" in the main README says depends on
legal/security review rather than code alone.

## Files

```
server.js         Express app — document CRUD, audit-event capture with real IP
storage.js        flat-JSON storage — replace with a real DB before real use
package.json      dependencies
.env.example      copy to .env
documents.json    created automatically on first save (git-ignored)
```
