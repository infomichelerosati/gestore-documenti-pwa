// service-worker.js

// Aumentiamo la versione della cache per forzare l'aggiornamento
const CACHE_NAME = 'gestore-documenti-cache-v2';

// Definiamo i file fondamentali dell' "app shell" da salvare subito
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
        console.log('Cache aperta, aggiungo i file principali.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento di fetch: intercetta tutte le richieste di rete.
self.addEventListener('fetch', event => {
  // Ignora le richieste che non sono di tipo GET (es. POST)
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // Strategia: Network falling back to Cache
    fetch(event.request)
      .then(networkResponse => {
        // Se la richiesta di rete ha successo, la usiamo
        // e ne salviamo una copia nella cache per il futuro.
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            // Salva in cache solo se la risposta è valida
            if(networkResponse.status === 200) {
              cache.put(event.request, responseToCache);
            }
          });
        return networkResponse;
      })
      .catch(() => {
        // Se la richiesta di rete fallisce (es. l'utente è offline),
        // proviamo a vedere se abbiamo una risposta salvata nella cache.
        console.log(`Fetch fallito per ${event.request.url}; cerco nella cache.`);
        return caches.match(event.request);
      })
  );
});


// Evento di attivazione: pulisce le vecchie cache non più necessarie.
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
    })
  );
});

