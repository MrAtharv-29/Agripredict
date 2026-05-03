// PWA KILL SWITCH
// This service worker immediately deletes all PWA caches and unregisters itself.
// This permanently disables aggressive offline caching for the application.

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach(client => client.navigate(client.url));
    })
  );
});

self.addEventListener('fetch', (event) => {
    // Pass through, no caching
    event.respondWith(fetch(event.request));
});
