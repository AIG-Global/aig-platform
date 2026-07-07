// ============================================================
// AIG Business Weather — Service Worker
//
// This is the piece that makes background alerts possible: once
// registered, the browser can wake this file up to show a notification
// even if the AIG Business Weather tab isn't open — as long as the
// browser itself is running and a real backend (see /backend-example)
// is actually sending push messages. This file alone does nothing
// without that backend; it only defines how to react when a push
// arrives.
// ============================================================

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = { title: "AIG Business Weather", body: "A hazard alert was received.", url: "/" };
  try {
    if (event.data) payload = Object.assign(payload, event.data.json());
  } catch (e) {
    // If the push payload isn't JSON, fall back to the default text above
    // rather than throwing and silently dropping the notification.
  }

  // isBigWarning mirrors the foreground app's big red "SEVERE WEATHER
  // WARNING!" modal escalation rule (extreme severity, or severe
  // severity matching a specific high-impact type) — see
  // isBigWarningWorthy() in backend-example/server.js, which sets this
  // flag before sending. Kept consistent deliberately: the same
  // tornado/typhoon/earthquake/flood warning should be just as hard to
  // miss whether the tab is open or this arrived as a background push.
  const options = {
    body: payload.body,
    icon: payload.icon || undefined,
    badge: payload.badge || undefined,
    data: { url: payload.url || "/" },
    tag: payload.tag || undefined, // same tag replaces a still-visible notification instead of stacking
    requireInteraction: !!payload.isBigWarning,
    vibrate: payload.isBigWarning ? [200, 100, 200] : undefined
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
