// ============================================================
// AIG MoneyGames — accounts + monthly competition mechanics.
//
// PLAY MONEY ONLY, always. The balance here is a monthly competition
// score, not currency — it resets to 10,000 automatically on the 1st
// of every month, can never be bought with real money, and can never
// be cashed out for anything of real value. It exists purely to make
// a friendly, recurring community competition.
// ============================================================

(function () {
  "use strict";

  const USERS_KEY = "aigmg_users_v1";
  const SESSION_KEY = "aigmg_session_v1";
  const MONTHLY_GRANT = 10000;

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
  function normalizeEmail(email) { return String(email || "").trim().toLowerCase(); }
  function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  function currentMonthKey(d) { d = d || new Date(); return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0"); }
  function currentYear(d) { d = d || new Date(); return d.getUTCFullYear(); }

  async function register({ email, password, nickname }) {
    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) throw new Error("Enter a valid email address.");
    if (!password || password.length < 8) throw new Error("Password must be at least 8 characters.");
    const cleanNickname = (nickname || "").trim();
    if (!cleanNickname || cleanNickname.length < 3) throw new Error("Pick a nickname of at least 3 characters — this is what appears on the leaderboards, not your email.");
    if (cleanNickname.length > 20) throw new Error("Nicknames are limited to 20 characters.");

    const users = loadUsers();
    if (users[normalizedEmail]) throw new Error("An account with this email already exists.");
    if (Object.values(users).some(u => u.nickname.toLowerCase() === cleanNickname.toLowerCase())) {
      throw new Error("That nickname is already taken — pick another.");
    }

    const passwordHash = await sha256(password);
    users[normalizedEmail] = {
      email: normalizedEmail,
      passwordHash,
      nickname: cleanNickname,
      createdAt: new Date().toISOString(),
      currentMonthKey: currentMonthKey(),
      balance: MONTHLY_GRANT,
      monthlyHistory: [],   // [{monthKey, netChange, finalBalance}]
      yearlyTotals: {}       // {year: cumulativeNetChange}
    };
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalizedEmail }));
    return applyRolloverIfNeeded(normalizedEmail);
  }

  async function login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const users = loadUsers();
    const user = users[normalizedEmail];
    if (!user) throw new Error("No account found with that email.");
    const passwordHash = await sha256(password || "");
    if (passwordHash !== user.passwordHash) throw new Error("Incorrect password.");
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalizedEmail }));
    return applyRolloverIfNeeded(normalizedEmail);
  }

  function logout() { localStorage.removeItem(SESSION_KEY); }

  // ============================================================
  // Monthly rollover — the actual "10,000 coins on the 1st" mechanic.
  // Called on every login/boot rather than relying on a scheduled job
  // (there's no server here to run one against in the frontend-only
  // demo) — so the rollover happens the next time the player shows up,
  // dated correctly by their own device clock, not by "whenever a
  // cron job happens to run."
  // ============================================================
  function applyRolloverIfNeeded(email) {
    const users = loadUsers();
    const user = users[email];
    if (!user) return null;

    const nowMonthKey = currentMonthKey();
    if (user.currentMonthKey !== nowMonthKey) {
      const netChange = user.balance - MONTHLY_GRANT;
      const completedMonthYear = parseInt(user.currentMonthKey.split("-")[0], 10);

      user.monthlyHistory.push({ monthKey: user.currentMonthKey, netChange, finalBalance: user.balance });
      user.monthlyHistory = user.monthlyHistory.slice(-24); // cap history growth; 24 months is plenty for the yearly view

      user.yearlyTotals[completedMonthYear] = (user.yearlyTotals[completedMonthYear] || 0) + netChange;

      user.currentMonthKey = nowMonthKey;
      user.balance = MONTHLY_GRANT;

      users[email] = user;
      saveUsers(users);
    }
    return Object.assign({}, users[email], { passwordHash: undefined });
  }

  function getCurrentUser() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!session || !session.email) return null;
      const users = loadUsers();
      const record = users[session.email];
      if (!record) return null;
      return Object.assign({}, record, { passwordHash: undefined });
    } catch (e) { return null; }
  }

  function updateBalance(email, newBalance) {
    const users = loadUsers();
    if (!users[email]) return null;
    users[email].balance = newBalance;
    saveUsers(users);
    return users[email];
  }

  // ============================================================
  // Leaderboards — local aggregation across every account registered
  // in THIS browser (demo scope; a real shared community leaderboard
  // needs the backend — see backend-example/). Ranked by nickname only,
  // never by email, on purpose.
  // ============================================================
  function monthlyLeaderboard(monthKey) {
    const key = monthKey || currentMonthKey();
    const users = Object.values(loadUsers());
    const isCurrentMonth = key === currentMonthKey();
    const rows = users.map(u => {
      if (isCurrentMonth && u.currentMonthKey === key) {
        return { nickname: u.nickname, netChange: u.balance - MONTHLY_GRANT };
      }
      const entry = u.monthlyHistory.find(h => h.monthKey === key);
      return entry ? { nickname: u.nickname, netChange: entry.netChange } : null;
    }).filter(Boolean);
    rows.sort((a, b) => b.netChange - a.netChange);
    return rows.slice(0, 100);
  }

  function yearlyLeaderboard(year) {
    const y = year || currentYear();
    const users = Object.values(loadUsers());
    const rows = users.map(u => {
      let total = u.yearlyTotals[y] || 0;
      if (u.currentMonthKey && u.currentMonthKey.startsWith(String(y))) total += (u.balance - MONTHLY_GRANT);
      return { nickname: u.nickname, total };
    });
    rows.sort((a, b) => b.total - a.total);
    return rows.slice(0, 100);
  }

  window.AIGMGAuth = {
    MONTHLY_GRANT, register, login, logout, getCurrentUser, updateBalance,
    currentMonthKey, currentYear, monthlyLeaderboard, yearlyLeaderboard, applyRolloverIfNeeded
  };
})();
