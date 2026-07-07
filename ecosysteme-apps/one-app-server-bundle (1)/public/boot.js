// ============================================================
// public/boot.js — Kicks off the admin app once every page module
// has registered itself on window. Split into its own file (rather
// than an inline <script> tag) so the dashboard's Content-Security-
// Policy can stay at the strict "script-src 'self'" with no
// 'unsafe-inline' exception.
// ============================================================
window.ONE_ADMIN_BOOT && window.ONE_ADMIN_BOOT();
