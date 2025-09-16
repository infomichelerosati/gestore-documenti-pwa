// service-worker.js

// Versione della cache incrementata a v4 per forzare l'aggiornamento
const CACHE_NAME = 'gestore-documenti-cache-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Evento di installazione: memorizza nella cache i file principali dell'app.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache v4 aperta, aggiungo i file principali.');
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

// Evento di fetch: Utilizza la strategia "Stale-While-Revalidate".
self.addEventListener('fetch', event => {
  // Ignora richieste che non sono di tipo GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      // 1. Prova a trovare la risorsa nella cache
      return cache.match(event.request).then(cachedResponse => {
        // 2. In parallelo, fai una richiesta di rete per aggiornare la cache
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Se la richiesta di rete ha successo, aggiorna la cache
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // 3. Restituisci subito la risposta dalla cache se c'è,
        // altrimenti attendi la risposta dalla rete.
        // L'aggiornamento della cache avverrà in background senza bloccare l'utente.
        return cachedResponse || fetchPromise;
      });
    })
  );
});

