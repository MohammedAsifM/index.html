const CACHE_NAME = 'weather-app-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/favicon.png', 
  '/screenshot1.png', 
  '/screenshot2.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(assetsToCache))
      .then(() => self.skipWaiting()) // Activate the service worker immediately
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name); // Clean up old caches
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if available, otherwise fetch from network
        return response || fetch(event.request).then(networkResponse => {
          // Optionally cache the new network response
          if (event.request.method === 'GET') {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Handle errors, possibly returning a fallback response
        return caches.match('/');
      })
  );
});
