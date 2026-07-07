// ============================================================
// Auth — local stand-in for a real backend auth service.
//
// Every function here is async and returns/throws the same shape a
// real network call would, specifically so this file can be deleted
// and replaced with real API calls (e.g. fetch("/api/auth/login", ...))
// without touching index.html or app.js. Nothing else in the app talks
// to localStorage for user data directly — it all goes through these
// functions and AIGMeAuth.getCurrentUser().
//
// SECURITY NOTE: this stand-in stores passwords hashed with a simple
// browser-side SHA-256 (via Web Crypto), which is NOT a substitute for
// real backend authentication (proper salting, bcrypt/argon2, rate
// limiting, etc). It exists only so the registration/login *flow* can
// be built and tested before a real backend exists. Treat every
// account created here as a local demo account, not a secure one.
// ============================================================

(function () {
  "use strict";

  const USERS_KEY = "aigme_auth_users_v1";
  const SESSION_KEY = "aigme_auth_session_v1";
  const TERMS_VERSION = "2026-06-30";

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    } catch (e) { return {}; }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Register a new account. Throws on any validation failure.
   *
   * @param {{email: string, password: string, termsAccepted: boolean}} params
   * @returns {Promise<{email: string}>}
   */
  async function register({ email, password, termsAccepted }) {
    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) throw new Error("Enter a valid email address.");
    if (!password || password.length < 8) throw new Error("Password must be at least 8 characters.");
    if (!termsAccepted) throw new Error("You must accept the terms to create an account.");

    const users = loadUsers();
    if (users[normalizedEmail]) throw new Error("An account with this email already exists.");

    const passwordHash = await sha256(password);
    users[normalizedEmail] = {
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      disclosureVersion: TERMS_VERSION
    };
    saveUsers(users);

    const session = { email: normalizedEmail, since: new Date().toISOString() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { email: normalizedEmail };
  }

  /**
   * @param {{email: string, password: string}} params
   * @returns {Promise<{email: string}>}
   */
  async function login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const users = loadUsers();
    const user = users[normalizedEmail];
    if (!user) throw new Error("No account found with that email.");
    const passwordHash = await sha256(password || "");
    if (passwordHash !== user.passwordHash) throw new Error("Incorrect password.");

    const session = { email: normalizedEmail, since: new Date().toISOString() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { email: normalizedEmail };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * @returns {{email: string}|null}
   */
  function getCurrentUser() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!session || !session.email) return null;
      const users = loadUsers();
      if (!users[session.email]) return null; // session refers to a deleted/missing account
      return { email: session.email };
    } catch (e) { return null; }
  }

  function getUserRecord(email) {
    const users = loadUsers();
    return users[normalizeEmail(email)] || null;
  }

  /**
   * Namespaces a storage key to the current user, so each account has
   * its own watchlist / API keys / preferences instead of one shared
   * blob. Falls back to a "guest" namespace if nobody is logged in,
   * which should never actually be reachable once the app requires
   * login, but keeps this function safe to call defensively.
   */
  function scopedKey(baseKey) {
    const user = getCurrentUser();
    const ns = user ? user.email : "guest";
    return baseKey + "::" + ns;
  }

  window.AIGMeAuth = {
    register,
    login,
    logout,
    getCurrentUser,
    getUserRecord,
    scopedKey,
    TERMS_VERSION: TERMS_VERSION
  };
})();
