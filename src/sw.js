import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Version caches
const JSON_CACHE_VERSION = 'v4';
const SQLITE_CACHE_VERSION = 'v2';
const VIEW_CACHE_VERSION = 'v4';
const RESOURCES_CACHE_VERSION = 'v1';

//Nombre caches
const JSON_CACHE = `json-cache-${JSON_CACHE_VERSION}`;
const SQLITE_CACHE = `sqlite-cache-${SQLITE_CACHE_VERSION}`;
const VIEW_CACHE = `view-cache-${VIEW_CACHE_VERSION}`;
const RESOURCES_CACHE = `resources-cache-${RESOURCES_CACHE_VERSION}`;

// Precargar solo recursos definidos en vite-plugin-pwa (__WB_MANIFEST)
precacheAndRoute(self.__WB_MANIFEST);


//Handle navegación cuando todo cacheado con el botón
const handler = createHandlerBoundToURL('/index.html');

registerRoute(
    ({ request }) => request.mode === 'navigate',
    handler
);

// Recursos manuales. Esto si se usase en el futuro.
const jsonResources = [];
const sqliteResources = [];
const viewResources = [];
const ImgResources = [];

// Limpia versiones antiguas
async function cleanOldCaches() {
    const validCaches = [JSON_CACHE, SQLITE_CACHE, RESOURCES_CACHE, VIEW_CACHE];
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

const viewStrategy = new CacheFirst({
    cacheName: VIEW_CACHE,
    plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
});

const resourcesStrategy = new CacheFirst({
    cacheName: RESOURCES_CACHE,
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
        await preloadCache(VIEW_CACHE, viewResources);
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
registerRoute( //Handle manual que hay que tanquearse
    ({ url }) => url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.wasm'),
    async ({ request }) => {
        const cache = await caches.open(VIEW_CACHE);
        const cachedResponse = await cache.match(request.url);
        if (cachedResponse) {
            return cachedResponse;
        }
        try {
            const response = await fetch(request);
            return response;
        } catch (err) {
            console.error('[SW] Fetch fallido:', request.url, err);
            throw err;
        }
    }
);

registerRoute(
    ({ url }) => url.pathname.endsWith('.json'),
    ({ event, request }) => jsonStrategy.handle({ event, request })
);

registerRoute(
    ({ url }) =>
        url.pathname.endsWith('.sqlite3'),
    ({ event, request }) => sqliteStrategy.handle({ event, request })
);

registerRoute(
    ({ url }) => !url.pathname.endsWith('.json') &&
        !url.pathname.endsWith('.sqlite3') &&
        !url.pathname.endsWith('.js') &&
        !url.pathname.endsWith('.css') &&
        !url.pathname.endsWith('.wasm'),
    ({ event, request }) => resourcesStrategy.handle({ event, request })
);

self.addEventListener('message', async (event) => {
    if (event.data?.type !== 'CACHE_ALL_RESOURCES') return;

    const failed = [];

    try {
        const res = await fetch('/file-index.json');
        if (!res.ok) throw new Error(`Error al hacer fetch de /file-index.json: ${res.status}`);
        const docs = await res.json();

        const cachesMap = {
            json: await caches.open(JSON_CACHE),
            sqlite: await caches.open(SQLITE_CACHE),
            view: await caches.open(VIEW_CACHE),
            resources: await caches.open(RESOURCES_CACHE),
        };

        for (const url of docs) {
            console.log(url);
            const cacheKey = getCacheKeyForUrl(url);
            const cache = cachesMap[cacheKey];

            const cachedResponse = await cache.match(url);
            if (cachedResponse) continue; // skip if cached

            try {
                // Fetch original response, no modification!
                const absoluteUrl = new URL(url, self.location.origin).href;
                const response = await fetch(absoluteUrl, { credentials: 'same-origin' });
                if (!response.ok) throw new Error(`Error al fetchear ${url}: ${response.status}`);

                // Cache the response as-is (clone it)
                await cache.put(url, response.clone());
            } catch (err) {
                failed.push(url);
            }
        }

        // Notify clients about result
        const clients = await self.clients.matchAll();
        clients.forEach(client =>
            client.postMessage({
                type: failed.length === 0 ? 'EVERYTHING_CACHED' : 'FAIL_TO_CACHE',
                failed,
            })
        );
    } catch (err) {
        const clients = await self.clients.matchAll();
        clients.forEach(client =>
            client.postMessage({ type: 'FAIL_TO_CACHE', error: err.message })
        );
    }
});

function getCacheKeyForUrl(url) {
    const ext = url.split('.').pop().toLowerCase();
    if (ext === 'json') return 'json';
    if (ext === 'sqlite3') return 'sqlite';
    if (ext === 'js' || ext === 'css' || ext === 'wasm') return 'view'
    return 'resources';
}