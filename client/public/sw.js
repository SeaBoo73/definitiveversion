// Service Worker per PWA SeaGO
const CACHE_NAME = 'seago-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Restituisci dalla cache se disponibile
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});