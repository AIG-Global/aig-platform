// ============================================================
// AIG Secure Sign — accounts.
//
// Same local-stand-in pattern used across the AIG app family: real
// async functions shaped like real backend calls, swappable for an
// actual backend later without touching the UI code that calls them.
// See backend-example/ for a real reference server.
//
// SECURITY NOTE: like the other AIG apps' local auth, this hashes
// passwords with SHA-256 client-side, which is NOT real security (no
// salting, no server-side protection, no rate limiting). Treat every
// account created here as a local demo account. A production
// e-signature platform's account system is itself part of what a
// lawyer/security review needs to look at — who can create a document,
// who can sign as whom, session handling, etc. — not just this file.
// ============================================================

(function () {
  "use strict";

  const USERS_KEY = "aigsign_users_v1";
  const SESSION_KEY = "aigsign_session_v1";

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

  async function register({ email, password, fullName }) {
    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) throw new Error("Enter a valid email address.");
    if (!password || password.length < 8) throw new Error("Password must be at least 8 characters.");
    if (!fullName || !fullName.trim()) throw new Error("Enter your full legal name — this is what will appear on documents you sign.");

    const users = loadUsers();
    if (users[normalizedEmail]) throw new Error("An account with this email already exists.");

    const passwordHash = await sha256(password);
    users[normalizedEmail] = {
      email: normalizedEmail,
      passwordHash,
      fullName: fullName.trim(),
      createdAt: new Date().toISOString(),
      identityVerification: { status: "not_started" } // see kyc.js
    };
    saveUsers(users);

    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalizedEmail, since: new Date().toISOString() }));
    return { email: normalizedEmail, fullName: fullName.trim() };
  }

  async function login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const users = loadUsers();
    const user = users[normalizedEmail];
    if (!user) throw new Error("No account found with that email.");
    const passwordHash = await sha256(password || "");
    if (passwordHash !== user.passwordHash) throw new Error("Incorrect password.");
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalizedEmail, since: new Date().toISOString() }));
    return { email: normalizedEmail, fullName: user.fullName };
  }

  function logout() { localStorage.removeItem(SESSION_KEY); }

  function getCurrentUser() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!session || !session.email) return null;
      const users = loadUsers();
      const record = users[session.email];
      if (!record) return null;
      return { email: record.email, fullName: record.fullName, identityVerification: record.identityVerification };
    } catch (e) { return null; }
  }

  function getUserRecord(email) {
    const users = loadUsers();
    return users[normalizeEmail(email)] || null;
  }

  function updateUserRecord(email, patch) {
    const users = loadUsers();
    const key = normalizeEmail(email);
    if (!users[key]) return null;
    users[key] = Object.assign({}, users[key], patch);
    saveUsers(users);
    return users[key];
  }

  function scopedKey(baseKey) {
    const user = getCurrentUser();
    const ns = user ? user.email : "guest";
    return baseKey + "::" + ns;
  }

  window.AIGSignAuth = { register, login, logout, getCurrentUser, getUserRecord, updateUserRecord, scopedKey };
})();
