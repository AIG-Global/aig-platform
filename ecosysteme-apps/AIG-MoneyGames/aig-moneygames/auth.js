// ============================================================
// AIG MoneyGames — accounts + coin-based monthly competition.
//
// PLAY MONEY ONLY. The score is coin count: how many coins you have
// now and the coin balance you finish the month with.
// ============================================================

(function () {
  "use strict";

  const USERS_KEY = "aigmg_users_v1";
  const SESSION_KEY = "aigmg_session_v1";
  const MONTHLY_GRANT = 10000;

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
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
    if (!cleanNickname || cleanNickname.length < 3) throw new Error("Pick a nickname of at least 3 characters.");
    if (cleanNickname.length > 20) throw new Error("Nicknames are limited to 20 characters.");

    const users = loadUsers();
    if (users[normalizedEmail]) throw new Error("An account with this email already exists.");
    if (Object.values(users).some((u) => u.nickname.toLowerCase() === cleanNickname.toLowerCase())) {
      throw new Error("That nickname is already taken.");
    }

    const passwordHash = await sha256(password);
    users[normalizedEmail] = {
      email: normalizedEmail,
      passwordHash,
      nickname: cleanNickname,
      createdAt: new Date().toISOString(),
      currentMonthKey: currentMonthKey(),
      balance: MONTHLY_GRANT,
      monthlyHistory: [], // [{ monthKey, finalBalance }]
      yearlyTotals: {},   // { [year]: cumulativeNetChange }
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

  function applyRolloverIfNeeded(email) {
    const users = loadUsers();
    const user = users[email];
    if (!user) return null;

    const nowMonth = currentMonthKey();
    if (user.currentMonthKey !== nowMonth) {
      const closedYear = parseInt(user.currentMonthKey.split("-")[0], 10);
      const netChange = user.balance - MONTHLY_GRANT;

      user.monthlyHistory.push({ monthKey: user.currentMonthKey, finalBalance: user.balance, netChange });
      user.monthlyHistory = user.monthlyHistory.slice(-24);

      user.yearlyTotals[closedYear] = (user.yearlyTotals[closedYear] || 0) + netChange;
      user.currentMonthKey = nowMonth;
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
    } catch (e) {
      return null;
    }
  }

  function updateBalance(email, newBalance) {
    const users = loadUsers();
    if (!users[email]) return null;

    users[email].balance = newBalance;
    saveUsers(users);
    return users[email];
  }

  // Monthly ranking: score is end-of-month coin balance.
  function monthlyLeaderboard(monthKey) {
    const key = monthKey || currentMonthKey();
    const users = Object.values(loadUsers());
    const isCurrentMonth = key === currentMonthKey();

    const rows = users.map((u) => {
      if (isCurrentMonth && u.currentMonthKey === key) {
        return { nickname: u.nickname, coins: u.balance };
      }
      const entry = u.monthlyHistory.find((h) => h.monthKey === key);
      return entry ? { nickname: u.nickname, coins: entry.finalBalance } : null;
    }).filter(Boolean);

    rows.sort((a, b) => b.coins - a.coins);
    return rows.slice(0, 100);
  }

  // Yearly ranking: best end-of-month coin finish achieved this year.
  function yearlyLeaderboard(year) {
    const y = year || currentYear();
    const users = Object.values(loadUsers());

    const rows = users.map((u) => {
      const historical = (u.monthlyHistory || [])
        .filter((h) => String(h.monthKey || "").startsWith(String(y)))
        .map((h) => Number(h.finalBalance) || 0);

      if (u.currentMonthKey && u.currentMonthKey.startsWith(String(y))) {
        historical.push(Number(u.balance) || 0);
      }

      const bestMonthCoins = historical.length ? Math.max(...historical) : 0;
      return { nickname: u.nickname, bestMonthCoins };
    });

    rows.sort((a, b) => b.bestMonthCoins - a.bestMonthCoins);
    return rows.slice(0, 100);
  }

  window.AIGMGAuth = {
    MONTHLY_GRANT,
    register,
    login,
    logout,
    getCurrentUser,
    updateBalance,
    currentMonthKey,
    currentYear,
    monthlyLeaderboard,
    yearlyLeaderboard,
    applyRolloverIfNeeded,
  };
})();
