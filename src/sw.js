import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Version caches
const JSON_CACHE_VERSION = 'v2';
const SQLITE_CACHE_VERSION = 'v1';
const DOCS_CACHE_VERSION = 'v3';

//Nombre caches
const JSON_CACHE = `json-cache-${JSON_CACHE_VERSION}`;
const SQLITE_CACHE = `sqlite-cache-${SQLITE_CACHE_VERSION}`;
const DOCS_CACHE = `docs-cache-${DOCS_CACHE_VERSION}`;

// Precargar solo recursos definidos en vite-plugin-pwa (__WB_MANIFEST)
precacheAndRoute(self.__WB_MANIFEST);

// Recursos manuales
const jsonResources = [ /* '/data/version.json', etc. */]; //AQUI HABRÁ QUE METER EL JSON DE BÚSQUEDA CREO
const sqliteResources = [ /* '/data/database.sqlite', etc. */];
const docsResources = ['/', /* index.html u otros si quieres */];

// Limpia versiones antiguas
async function cleanOldCaches() {
    const validCaches = [JSON_CACHE, SQLITE_CACHE, DOCS_CACHE];
    const existingCaches = await caches.keys();
    let deletedAny = false;

    for (const cache of existingCaches) {
        if (!validCaches.includes(cache) && !cache.startsWith('workbox-precache-')) {
            await caches.delete(cache);
            deletedAny = true;
        }
    }

    return deletedAny;
}


//Estrategias
const jsonStrategy = new CacheFirst({
    cacheName: JSON_CACHE,
    plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
});

const sqliteStrategy = new CacheFirst({
    cacheName: SQLITE_CACHE,
    plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
});

const docsStrategy = new CacheFirst({
    cacheName: DOCS_CACHE,
    plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
});


// precarga caché
async function preloadCache(cacheName, resources) {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
}

// Instalación
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        await preloadCache(DOCS_CACHE, docsResources);
        console.log('[SW] Instalado y precargado');
        self.skipWaiting();
    })());
});

// Activación
self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        await self.clients.claim();
        const cleaned = await cleanOldCaches();

        if (cleaned) {
            const clients = await self.clients.matchAll({ includeUncontrolled: true });
            await Promise.all(
                clients.map(client => client.postMessage({ type: 'NEW_VERSION_AVAILABLE' }))
            );
        }

        console.log('[SW] Activado y controlando clientes');
    })());
});

// fetch
registerRoute(
    ({ request }) =>
        request.destination === 'document' || request.destination === 'script' || request.destination === 'style' || request.destination === 'image'
    ,
    ({ event, request }) => docsStrategy.handle({ event, request })
);

registerRoute(
    ({ url }) => url.pathname.endsWith('.json'),
    ({ event, request }) => jsonStrategy.handle({ event, request })
);

registerRoute(
    ({ url }) =>
        url.pathname.endsWith('.sqlite') ||
        url.pathname.endsWith('.sqlite-shm') ||
        url.pathname.endsWith('.sqlite-wal'),
    ({ event, request }) => sqliteStrategy.handle({ event, request })
);

self.addEventListener('message', async (event) => {
    if (event.data?.type === 'CACHE_ALL_RESOURCES') {
        try {
            const response = await fetch('/file-index.json');
            const allResources = await response.json();

            for (const path of allResources) {
                const url = new URL(path, self.location.origin);
                const pathname = url.pathname;

                // Clasificación de caché según extensión
                let cacheName;
                if (
                    pathname.endsWith('.sqlite') ||
                    pathname.endsWith('.sqlite-shm') ||
                    pathname.endsWith('.sqlite-wal')
                ) {
                    cacheName = SQLITE_CACHE;
                } else if (pathname.endsWith('.json')) {
                    cacheName = JSON_CACHE;
                } else {
                    cacheName = DOCS_CACHE;
                }

                try {
                    const cache = await caches.open(cacheName);
                    await cache.add(new Request(url, { cache: 'reload' }));
                    console.log(`[SW] Se ha cacheado ${url} en ${cacheName}`);
                } catch (e) {
                    console.warn(`[SW] Fallo al cachear ${url}:`, e);
                }
            }

            const clients = await self.clients.matchAll({ includeUncontrolled: true });
            await Promise.all(
                clients.map(client => {
                    client.postMessage({ type: 'EVERYTHING_CACHED' });
                })
            );

        } catch (err) {
            console.error('[SW] Fallo al fetchear file-index.json:', err);
            const clients = await self.clients.matchAll({ includeUncontrolled: true });
            await Promise.all(
                clients.map(client => {
                    client.postMessage({ type: 'FAIL_TO_CACHE' });
                }))
        }
    }
});