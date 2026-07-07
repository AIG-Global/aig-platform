// ============================================================
// AIG MoneyGames — backend example.
//
// What this actually solves: the frontend-only demo's leaderboard only
// ever shows players registered in the SAME browser (localStorage
// can't see other people's devices) — which defeats the point of a
// community competition. This backend is real shared storage, so the
// leaderboard reflects every real player.
//
// It also runs an actual scheduled job (node-cron, "0 0 1 * *" — literal
// midnight on the 1st of every month) that rolls EVERY account over at
// once, rather than relying on each player happening to log in after
// the month changes (which is what the frontend-only demo does, and
// is a reasonable fallback but not as clean).
//
// PLAY MONEY ONLY — same as the frontend. No endpoint here accepts or
// returns anything resembling real currency. Balances are free,
// worthless outside this app, and reset every month by design.
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const cron = require("node-cron");
const storage = require("./storage");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;
const MONTHLY_GRANT = 10000;

function sha256(text) { return crypto.createHash("sha256").update(text).digest("hex"); }
function currentMonthKey(d) { d = d || new Date(); return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0"); }
function currentYear(d) { d = d || new Date(); return d.getUTCFullYear(); }
function normalizeEmail(e) { return String(e || "").trim().toLowerCase(); }

// ============================================================
// Accounts
// ============================================================
app.post("/api/register", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password, nickname } = req.body;
  if (!email || !password || password.length < 8) return res.status(400).json({ error: "Valid email and an 8+ character password are required." });
  const cleanNickname = (nickname || "").trim();
  if (!cleanNickname || cleanNickname.length < 3 || cleanNickname.length > 20) return res.status(400).json({ error: "Nickname must be 3-20 characters." });

  const existing = await storage.getUserByEmail(email);
  if (existing) return res.status(409).json({ error: "An account with this email already exists." });
  const nicknameTaken = await storage.getUserByNickname(cleanNickname);
  if (nicknameTaken) return res.status(409).json({ error: "That nickname is already taken." });

  const user = {
    email, passwordHash: sha256(password), nickname: cleanNickname,
    createdAt: new Date().toISOString(),
    currentMonthKey: currentMonthKey(), balance: MONTHLY_GRANT,
    monthlyHistory: [], yearlyTotals: {}
  };
  await storage.upsertUser(user);
  res.json(publicUser(user));
});

app.post("/api/login", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const user = await storage.getUserByEmail(email);
  if (!user || sha256(req.body.password || "") !== user.passwordHash) return res.status(401).json({ error: "Invalid email or password." });
  res.json(publicUser(user));
});

app.post("/api/balance", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const user = await storage.getUserByEmail(email);
  if (!user) return res.status(404).json({ error: "Account not found." });
  // NOTE: a real deployment must verify this request is actually from
  // the authenticated account (a session token/JWT), not just trust an
  // email in the body — this demo omits that layer for simplicity, same
  // as the rest of the AIG app family's local-auth-pattern examples.
  user.balance = req.body.balance;
  await storage.upsertUser(user);
  res.json(publicUser(user));
});

function publicUser(user) { const { passwordHash, ...rest } = user; return rest; }

// ============================================================
// Leaderboards — real aggregation across every registered account.
// ============================================================
app.get("/api/leaderboard/monthly", async (req, res) => {
  const monthKey = req.query.month || currentMonthKey();
  const users = await storage.getAllUsers();
  const isCurrentMonth = monthKey === currentMonthKey();
  const rows = users.map(u => {
    if (isCurrentMonth && u.currentMonthKey === monthKey) return { nickname: u.nickname, netChange: u.balance - MONTHLY_GRANT };
    const entry = u.monthlyHistory.find(h => h.monthKey === monthKey);
    return entry ? { nickname: u.nickname, netChange: entry.netChange } : null;
  }).filter(Boolean);
  rows.sort((a, b) => b.netChange - a.netChange);
  res.json({ monthKey, leaderboard: rows.slice(0, 100) });
});

app.get("/api/leaderboard/yearly", async (req, res) => {
  const year = parseInt(req.query.year, 10) || currentYear();
  const users = await storage.getAllUsers();
  const rows = users.map(u => {
    let total = u.yearlyTotals[year] || 0;
    if (u.currentMonthKey && u.currentMonthKey.startsWith(String(year))) total += (u.balance - MONTHLY_GRANT);
    return { nickname: u.nickname, total };
  });
  rows.sort((a, b) => b.total - a.total);
  res.json({ year, leaderboard: rows.slice(0, 100) });
});

app.get("/api/health", async (req, res) => res.json({ ok: true, playerCount: await storage.count() }));

// ============================================================
// Scheduled monthly rollover — runs for EVERY account at once, right
// at the actual month boundary, rather than waiting for each player to
// individually log back in (which is what the frontend-only demo does
// as a fallback). This is the real advantage of having a backend for
// this specific feature.
// ============================================================
async function runMonthlyRollover() {
  const nowKey = currentMonthKey();
  const users = await storage.getAllUsers();
  let rolledOver = 0;
  for (const user of users) {
    if (user.currentMonthKey === nowKey) continue;
    const netChange = user.balance - MONTHLY_GRANT;
    const completedYear = parseInt(user.currentMonthKey.split("-")[0], 10);
    user.monthlyHistory.push({ monthKey: user.currentMonthKey, netChange, finalBalance: user.balance });
    user.monthlyHistory = user.monthlyHistory.slice(-24);
    user.yearlyTotals[completedYear] = (user.yearlyTotals[completedYear] || 0) + netChange;
    user.currentMonthKey = nowKey;
    user.balance = MONTHLY_GRANT;
    await storage.upsertUser(user);
    rolledOver++;
  }
  console.log("[" + new Date().toISOString() + "] Monthly rollover processed for " + rolledOver + " account(s).");
}

cron.schedule("0 0 1 * *", () => { runMonthlyRollover().catch(err => console.error("Monthly rollover failed:", err)); });

app.listen(PORT, () => {
  console.log("AIG MoneyGames backend listening on port " + PORT);
  runMonthlyRollover().catch(err => console.error("Startup rollover check failed:", err)); // catch up on any accounts due for rollover since last run
});
