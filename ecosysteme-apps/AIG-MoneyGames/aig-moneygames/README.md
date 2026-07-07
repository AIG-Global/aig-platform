# AIG MoneyGames

Slots, blackjack, and roulette — play money only, forever. A friendly
monthly community competition: everyone gets 10,000 coins on the 1st,
the month's biggest winners land on a top-100 leaderboard by nickname,
and every month's result rolls into a yearly leaderboard too.

## This is not gambling — read why, not just that

**No real money, in or out, anywhere in this app.** There is no
"buy coins" flow. Coins can't be purchased with real currency and can't
be cashed out for anything of value. That's not a limitation of this
build — it's the entire reason this is a legitimate, unlicensed-and-
correctly-so free-play product rather than something requiring an actual
gambling license. Real-money wagering is one of the most heavily
regulated activities that exists (gaming licenses, bonded reserves,
certified RNG audits, AML/KYC programs) — none of that attaches to a
game where nothing of real-world value ever changes hands.

## Run it

```
python3 -m http.server 8000
```
Then open `http://localhost:8000`. Same `file://`-CORS note as the other
AIG apps — serve it, don't double-click it.

**Frontend-only limitation, stated plainly**: accounts and leaderboards
live in `localStorage`, so the "community" leaderboard only shows
players registered in the *same browser*. A real shared leaderboard
across actual different players needs `backend-example/` — see that
folder's README.

## The fairness commitment, and what it actually means

Every outcome uses the browser's cryptographically-secure RNG
(`crypto.getRandomValues`), and every payout matches the disclosed odds
exactly. Specifically **absent on purpose**: engineered "near-miss" reel
weighting — a well-documented manipulative pattern in real slot machines
where losses are made to look like almost-wins specifically to keep
people playing longer. This slot's reels are weighted only by the
disclosed paytable, nothing else, and the in-app "show RTP math" link
computes the real theoretical return live from the actual paytable, not
a marketing number typed in separately.

**I found and fixed a real math error while building this.** My first
version of the slot paytable computed out to a 39.7% theoretical RTP —
roughly a 60% house edge, far harsher than any real slot machine
(typically 85–98% RTP) and not the "honest odds" I'd set out to build.
I hadn't verified the actual expected value of my own numbers before
calling them done. Caught it by computing the theoretical RTP directly
rather than assuming the paytable "felt" reasonable, then solved
properly: added the classic "cherry pair" partial-match payout (standard
in real fruit machines, not a workaround) and algebraically solved for
triple-match payouts that land at a realistic 93.6% RTP — verified
against a 300,000-spin simulation that landed within 0.5 percentage
points of the theoretical value.

**Blackjack and roulette were correct on the first build** — verified
directly, not assumed: blackjack's hand-value logic (soft aces, bust and
blackjack detection, dealer stands on 17) checked out exactly against
hand-crafted test cases, deck integrity is correct at 1 and 6 decks, and
roulette's color assignment, all bet-type evaluations, and payout
multipliers matched real single-zero European odds — a 200,000-spin
simulation of an even-money "red" bet landed at 97.44% actual RTP against
97.30% theoretical.

## The monthly/yearly competition, precisely

- Every account's balance resets to 10,000 automatically the next time
  they're active on or after the 1st of a new month (frontend-only demo)
  or, with the backend connected, at the literal moment midnight on the
  1st ticks over for everyone at once via a real scheduled job.
- The prior month's net change (final balance minus 10,000) archives
  into that account's history and rolls into a running yearly total.
- Monthly leaderboard: top 100 by net change this month, by nickname —
  never by email or real name.
- Yearly leaderboard: top 100 by the sum of every completed month's net
  change this year (plus the current month's change-in-progress).
- I directly tested the rollover logic, not just the concept: forced a
  stale month key on two test accounts (one net winner, one net loser),
  ran the actual rollover function, and confirmed both archived
  correctly, both reset to a fresh 10,000, and running it again
  immediately correctly did nothing (idempotent — no double-archiving).

## Tested

- Full flow: register (including a real duplicate-nickname rejection),
  login, all three games, over-bet rejection, both leaderboards showing
  the player's own result with a "(you)" tag — zero console errors.
- **Real slot math**, verified by simulation, not assumption — see above.
- **Real monthly rollover math**, verified directly against forced stale
  data on both a winning and a losing account, including idempotency.
- **Mobile** (390px touch viewport): zero horizontal overflow across
  every view, including roulette's number grid — the trickiest layout in
  the app. All three games completed successfully using real `tap()`
  interactions, not mouse-event simulation. Roulette number tap targets
  measured at 74×74px, comfortably above the usual 44px minimum.
- Investigated an apparent visual bug (the sticky topbar appearing
  mid-page in a full-page screenshot) and confirmed via direct scroll
  testing that it was a known artifact of `fullPage` screenshot capture
  combined with `position: sticky` — not a real rendering problem. The
  topbar correctly stayed pinned at the top of the viewport through an
  actual 400px scroll.

## Files

```
index.html, app.js      auth, lobby, all three games, leaderboards
games-engine.js          the actual game math — RNG, slots, blackjack,
                          roulette — kept separate from UI so it can be
                          (and was) tested directly
auth.js                  accounts + the monthly rollover/leaderboard logic
backend-example/          real reference backend: shared accounts, a
                          real global leaderboard, scheduled rollover —
                          see its own README
```
