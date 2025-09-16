// service-worker.js

const CACHE_NAME = 'gestore-documenti-cache-v1';
// Aggiungi qui le risorse fondamentali della tua app che vuoi memorizzare nella cache.
// Per ora, ci basta la pagina principale.
const urlsToCache = [
  '.',
  'index.html'
];

// Evento di installazione: viene eseguito quando il service worker viene installato.
self.addEventListener('install', event => {
  // Aspetta che la cache sia aperta e che i file principali siano stati aggiunti.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento di fetch: intercetta tutte le richieste di rete.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se la risorsa è nella cache, la restituisce.
        // Altrimenti, esegue la richiesta di rete.
        return response || fetch(event.request);
      }
    )
  );
});

// Evento di attivazione: pulisce le vecchie cache.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
