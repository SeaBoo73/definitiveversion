// SeaBoo Service Worker - v3.0.0 - DISABLED FOR NATIVE APP
// This SW is disabled to prevent caching issues in Capacitor native apps

const CACHE_NAME = 'seaboo-cache-v3.0.0';

// Install event - skip caching, immediately activate
self.addEventListener('install', (event) => {
  console.log('SeaBoo SW v3.0.0 installing - CACHING DISABLED...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Delete ALL caches
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      self.skipWaiting();
    })
  );
});

// Activate event - take control and clear all caches
self.addEventListener('activate', (event) => {
  console.log('SeaBoo SW v3.0.0 activated - ALL CACHES CLEARED');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - ALWAYS fetch from network, no caching
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
