// Service Worker - Planning COT H/K
const CACHE_NAME = 'cothk-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/logo-cohk.png',
  '/manifest.json'
];

// Installation : mise en cache des fichiers essentiels
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch : network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET et les requêtes vers Supabase
  if (event.request.method !== 'GET' || event.request.url.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Mettre en cache les réponses réussies
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si réseau indisponible, utiliser le cache
        return caches.match(event.request);
      })
  );
});
