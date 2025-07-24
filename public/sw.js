// SeaGO Service Worker - v2.1.0
const CACHE_NAME = 'seago-cache-v2.1.0';
const API_CACHE_NAME = 'seago-api-cache-v2.1.0';

// Install event - clear old caches and force update
self.addEventListener('install', (event) => {
  console.log('SeaGO SW v2.1.0 installing...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.skipWaiting(); // Force activation
    })
  );
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  console.log('SeaGO SW v2.1.0 activated');
  event.waitUntil(self.clients.claim());
});

// Fetch event - Network first for API calls, cache first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // API calls - always fetch fresh data
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }
  
  // Static assets - cache first
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});