// ============================================================
// register-sw.js — Registers the service worker. Split into its
// own file (rather than an inline <script> tag) so the app's
// Content-Security-Policy can stay at script-src 'self' with no
// 'unsafe-inline' exception, consistent with the admin dashboard.
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Non-fatal — the app still works fully online without the service worker.
    });
  });
}
