// Service worker voor de Fietsknooppuntenroute-app.
// Zorgt dat de app zelf en bekeken kaarttegels offline beschikbaar blijven.
// Werkt enkel op https:// (of localhost) — browsers staan service workers niet toe op file://.

const CACHE_VERSION = 'fietsapp-v61';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './base.css',
  './theme-tailwind.css',
  './theme-tailwind-screens.js',
  './zombie-run.js',
  './integrations.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];

// Hostnamen van kaarttegel-bronnen die de app gebruikt (zie TILE_PROVIDERS in index.html)
const TILE_HOSTS = [
  'tile.openstreetmap.org',
  'basemaps.cartocdn.com',
  'tile.openstreetmap.de'
];

// Grote, statische data-bestanden (knooppunten + POI's) die zelden veranderen. Deze veranderen zo
// weinig dat cache-first (met achtergrond-ververs) veel betrouwbaarder is dan network-first op een
// trage/wisselvallige mobiele verbinding, waar een groot bestand halverwege kan afbreken.
const STATIC_DATA_FILES = [
  'FietsWandelknoopBE.json', 'FietsWandelknoopNL.geojson',
  'PoiBelgie.geojson', 'PoiNederland.geojson'
];
// Kleine SVG-weericoontjes (eigen, gelicenseerde set), in images/weather/, herkenbaar aan het
// "wicon-"-voorvoegsel.
const STATIC_DATA_PREFIX = '/wicon-';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => { /* een enkel CDN-bestand kan falen zonder de rest te breken */ })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  const isTile = TILE_HOSTS.some((h) => url.hostname.endsWith(h));

  if (isTile) {
    // Kaarttegels: toon meteen de cache-versie als die er is (snel + offline-vriendelijk),
    // en ververs die op de achtergrond via het netwerk indien mogelijk.
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(req).then((cached) => {
          const networkFetch = fetch(req)
            .then((resp) => {
              if (resp && resp.ok) cache.put(req, resp.clone());
              return resp;
            })
            .catch(() => cached); // geen netwerk: val terug op wat al gecached is
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  const isStaticData = url.origin === self.location.origin &&
    (STATIC_DATA_FILES.some((f) => url.pathname.endsWith('/' + f)) || url.pathname.includes(STATIC_DATA_PREFIX));
  if (isStaticData) {
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(req).then((cached) => {
          // cache:'reload' dwingt een écht netwerkverzoek af, voorbij eventuele gecachete 404 van
          // een eerdere test (bv. toen het bestand nog niet in de repo stond) — anders zou de browser
          // z'n eigen HTTP-cache kunnen blijven hergebruiken, los van onze eigen Cache API hierboven.
          const networkFetch = fetch(req, { cache: 'reload' })
            .then((resp) => {
              if (resp && resp.ok) cache.put(req, resp.clone());
              return resp;
            })
            .catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  if (url.origin === self.location.origin || url.hostname === 'cdnjs.cloudflare.com') {
    // App-shell (HTML/JS/CSS): probeer eerst het netwerk (zodat je updates krijgt),
    // val bij geen netwerk terug op de gecachete versie.
    event.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
          }
          return resp;
        })
        .catch(() => caches.match(req))
    );
  }
  // Overige verzoeken (Overpass, Nominatim, OSRM, hoogte-API's): gewoon door naar het netwerk,
  // die zijn bewust niet blijvend gecached — dat is actuele data, geen statische kaartachtergrond.
});
