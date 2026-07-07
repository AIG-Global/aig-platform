// ============================================================
// sw.js — Minimal service worker for the ONE PWA.
//
// Caches the app shell (HTML/CSS/JS/icons) so the app still opens
// from the home screen icon even with no connection, and loads
// instantly on repeat opens. This is intentionally simple: a
// cache-first strategy for the static shell, falling back to the
// network for anything not pre-cached.
// ============================================================

const CACHE_NAME = 'one-app-shell-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './app.js',
  './data.js',
  './icons.js',
  './onboarding.js',
  './manifest.json',
  './assets/favicon.png',
  './assets/logo-icon.svg',
  './assets/logo-icon.png',
  './assets/ios/icon-192.png',
  './assets/ios/icon-512.png',
  './assets/ios/apple-touch-icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
