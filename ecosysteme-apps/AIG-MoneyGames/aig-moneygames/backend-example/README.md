# AIG MoneyGames — backend example

Solves two real limitations of the frontend-only demo:

1. **A real community leaderboard.** The frontend-only version can only
   ever show players registered in the *same browser* (that's what
   `localStorage` is). This backend is genuinely shared storage, so
   the monthly and yearly leaderboards reflect every real player.
2. **Scheduled rollover for everyone at once.** The frontend-only
   version rolls a player's balance over to a fresh 10,000 the next
   time *they personally* log in after the month changes — a
   reasonable fallback with no server, but not as clean as an actual
   scheduled reset. This backend runs a real cron job
   (`0 0 1 * *` — literally midnight on the 1st of every month) that
   rolls every account over at once, so last month's leaderboard is
   fully finalized immediately for everyone, not just people who
   happened to log back in.

**PLAY MONEY ONLY** — same as the frontend. Nothing in this backend
accepts, stores, or returns anything resembling real currency.

**Honesty check on "runnable":** written and syntax-checked carefully,
and the storage + rollover logic is unit-tested directly (register two
accounts, force a stale month key, run the actual rollover function,
confirm correct archiving and reset for both a net winner and a net
loser, confirm idempotency on a second run). Could not run the actual
Express server end-to-end — no npm registry access in this sandbox.
Test it yourself before depending on it.

## Setup

```bash
cd backend-example
npm install
cp .env.example .env
npm start
```

On startup, and then every midnight on the 1st of each month, it checks
every account and rolls over anyone whose stored month doesn't match the
real current month — this also catches accounts that were "due" for
rollover if the server happened to be down exactly at a month boundary.

## Connecting the frontend

The frontend currently does everything against `localStorage` (see
`auth.js`). To point it at this backend instead:

- `register()` / `login()` → `POST /api/register` / `POST /api/login`
- `updateBalance()` → `POST /api/balance`
- `monthlyLeaderboard()` / `yearlyLeaderboard()` → `GET
  /api/leaderboard/monthly` / `GET /api/leaderboard/yearly`

Like the other AIG apps with a real backend option, this needs the
synchronous localStorage calls converted to async fetch calls throughout
`app.js` and `auth.js` — a real refactor, not a one-line config flip,
since a shared multiplayer leaderboard inherently needs network calls at
more points than a single-player demo does.

**Note the same caveat as the storage layer**: `/api/balance` currently
trusts whatever email is in the request body — a real deployment needs
a real session/token layer verifying the request actually comes from
that authenticated account, not just an honor-system email field. This
is the same simplification the other AIG apps' local-auth-pattern
examples make; it's fine for trying this out, not fine for real players.

## Deploying this for real

Needs continuous hosting (a VPS, Railway, Render, Fly.io) for the
scheduled cron job to actually fire — a serverless platform would need
a scheduled-trigger equivalent (Vercel Cron, Cloudflare Cron Triggers)
calling `runMonthlyRollover` instead of relying on `node-cron`'s
in-process timer.

## Files

```
server.js       Express app — accounts, balance sync, leaderboard
                 aggregation, the scheduled monthly rollover job
storage.js      flat-JSON storage — replace with a real DB before real use
package.json    dependencies
.env.example    copy to .env
players.json    created automatically on first registration (git-ignored)
```
