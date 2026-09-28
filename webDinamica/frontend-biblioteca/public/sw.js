const CACHE_NAME = 'biblioteca-v3'; 
const ARCHIVOS_A_GUARDAR = [
  '/',
  '/manifest.json',
  '/offline' 
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // ¡Esto fuerza la actualización inmediata!
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_A_GUARDAR))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline');
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((respuestaEnCache) => {
        return respuestaEnCache || fetch(event.request);
      })
    );
  }
});