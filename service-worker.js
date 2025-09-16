// service-worker.js

// Aumentiamo la versione della cache per forzare l'aggiornamento
const CACHE_NAME = 'gestore-documenti-cache-v3';

// Definiamo i file fondamentali dell' "app shell" da salvare subito
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // Le librerie esterne verranno aggiunte alla cache dinamicamente al primo caricamento
];

// Evento di installazione: memorizza nella cache i file principali dell'app.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache v3 aperta, aggiungo i file principali.');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Forza l'attivazione del nuovo service worker
  );
});

// Evento di attivazione: pulisce le vecchie cache e prende il controllo della pagina.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Elimino vecchia cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prende il controllo immediato
  );
});

// Evento di fetch: intercetta tutte le richieste di rete con una strategia "Network falling back to cache".
self.addEventListener('fetch', event => {
  // Ignora richieste non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      // 1. Prova prima la rete
      return fetch(event.request)
        .then(networkResponse => {
          // 2. Se la rete funziona, aggiorna la cache
          // Per le richieste cross-origin non possiamo controllare lo status,
          // quindi le salviamo direttamente. Questo è un compromesso necessario.
          cache.put(event.request.url, networkResponse.clone());
          // E restituisci la risposta dalla rete
          return networkResponse;
        })
        .catch(() => {
          // 3. Se la rete fallisce, cerca nella cache
          console.log(`Fetch fallito per ${event.request.url}; cerco nella cache.`);
          return cache.match(event.request.url);
        });
    })
  );
});

