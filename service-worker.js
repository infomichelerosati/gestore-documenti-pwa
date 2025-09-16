// service-worker.js

// Versione della cache incrementata a v5 per forzare l'aggiornamento
const CACHE_NAME = 'gestore-documenti-cache-v5';

// Lista completa di tutte le risorse necessarie, incluse le librerie esterne.
// Questo garantisce che l'app sia autonoma una volta installata.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Librerie esterne fondamentali (CDN)
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/lucide@0.378.0/dist/umd/lucide.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  // Aggiunta cruciale per le anteprime PDF: il suo file "worker"
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

// Evento di installazione: scarica e salva tutte le risorse necessarie.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache v5 aperta. Inizio pre-caching di tutte le risorse necessarie.');
        // Dobbiamo gestire le richieste ai CDN, che possono non supportare CORS.
        // Creiamo richieste 'no-cors' per assicurarci di poterle salvare in cache.
        const requests = urlsToCache.map(url => new Request(url, { mode: 'no-cors' }));
        return cache.addAll(requests);
      })
      .then(() => {
          console.log('Tutte le risorse sono state salvate nella cache con successo.');
          return self.skipWaiting(); // Attiva subito il nuovo service worker
      })
      .catch(error => {
          console.error('Errore durante il pre-caching:', error);
      })
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
            console.log('Elimino vecchia cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento di fetch: usa una strategia "Cache First".
// Visto che abbiamo tutto in cache, questa è la strategia più veloce e affidabile.
self.addEventListener('fetch', event => {
  // Ignora richieste non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Se troviamo la risorsa nella cache, la usiamo.
        if (cachedResponse) {
          return cachedResponse;
        }
        // Se non è in cache (improbabile per le risorse principali),
        // la richiediamo dalla rete. Questo serve per gestire casi imprevisti.
        return fetch(event.request);
      })
  );
});

