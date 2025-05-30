import { cleanupOutdatedCaches } from 'workbox-precaching';
const precacheAssets = self.__WB_MANIFEST;

// Constantes
const SWVersion = 'v1'; //Hay que cambiar esto en cada despliegue. Hace que el SW sepa que cosas han cambiado
console.log('Versión SW: ' + SWVersion);
const CACHE_PREFIX = 'PRA-cache';
const VERSION_URL = '/version.json';
const VERSION_CACHE = 'version-cache';

const DOC_TYPES = ['page', 'json', 'sqlite'];

// Instala Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            await updateCaches();
            const cacheName = await getCurrentCacheName('page');
            const cache = await caches.open(cacheName);

            await Promise.all(
                precacheAssets.map(async (entry) => {
                    try {
                        const req = new Request(entry.url, {
                            integrity: entry.integrity,
                            cache: 'reload'
                        });
                        const response = await fetch(req);
                        if (response.ok) {
                            await cache.put(req, response);
                        } else {
                            console.warn('Failed to fetch precache asset:', entry.url);
                        }
                    } catch (e) {
                        console.warn('Error precaching asset:', entry.url, e);
                    }
                })
            )
            await self.skipWaiting();
        })()
    );
});

// Activar SW
self.addEventListener('activate', (event) => {
    event.waitUntil(
        cleanupOldCaches()
            .then(() => self.clients.claim())
    );
});

// Fetch Handling
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);


    //Evita que se cachee el doc de versionado
    if (url.pathname === VERSION_URL) {
        console.warn("Versión no cacheada.")
        return;
    }


    let cacheType = null;
    if (url.pathname.startsWith('/data/json/')) {
        cacheType = DOC_TYPES[1]; // 'json'
    } else if (url.pathname.startsWith('/data/sqlite/')) {
        cacheType = DOC_TYPES[2]; // 'sqlite'
    } else {
        cacheType = DOC_TYPES[0]; // 'page'
    }

    if (!cacheType) {
        return;
    }

    event.respondWith(
        getCurrentCacheName(cacheType).then(cacheName => {
            if (!cacheName) {
                return fetch(event.request);
            }

            return caches.open(cacheName).then(cache => {
                return cache.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request).then(networkResponse => {
                        if (networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch((e) => {
                        console.warn('Failed to fetch data', e);
                    });
                });
            });
        })
    );
});


// ---- Cache management ----

async function updateCaches() {
    const versionCache = await caches.open(VERSION_CACHE);

    try {
        const versionResp = await fetch(VERSION_URL, { cache: 'no-store' });
        if (!versionResp.ok) {
            console.warn('Failed to fetch version.json');
            return;
        }

        const serverVersions = await versionResp.json();

        for (const type of DOC_TYPES) {
            const serverVersion = serverVersions[type];
            if (!serverVersion) continue;

            const cachedVersionResp = await versionCache.match(type);
            const cachedVersion = cachedVersionResp ? await cachedVersionResp.text() : null;

            console.log(`[SW] ${type}: cached=${cachedVersion}, server=${serverVersion}`);

            if (cachedVersion !== serverVersion) {
                await deleteOldCaches(type);
                const newCacheName = getCacheName(type, serverVersion);
                await caches.open(newCacheName);
                await versionCache.put(type, new Response(serverVersion));
            }
        }
    } catch (e) {
        console.warn('[SW] updateCaches error:', e);
    }
}

async function deleteOldCaches(type) {
    const keys = await caches.keys();
    for (const key of keys) {
        if (key.startsWith(`${CACHE_PREFIX}-${type}-`)) {
            await caches.delete(key);
        }
    }
}

async function cleanupOldCaches() {
    const versionCache = await caches.open(VERSION_CACHE);

    const currentVersions = {};
    for (const type of DOC_TYPES) {
        const resp = await versionCache.match(type);
        currentVersions[type] = resp ? await resp.text() : null;
    }

    const keys = await caches.keys();
    for (const key of keys) {
        if (key === VERSION_CACHE) continue;

        for (const type of DOC_TYPES) {
            const expected = getCacheName(type, currentVersions[type]);
            if (key.startsWith(`${CACHE_PREFIX}-${type}-`) && key !== expected) {
                await caches.delete(key);
            }
        }
    }
}

function getCacheName(type, version) {
    return `${CACHE_PREFIX}-${type}-${version}`;
}

async function getCurrentCacheName(type) {
    const versionCache = await caches.open(VERSION_CACHE);
    const resp = await versionCache.match(type);
    const version = resp ? await resp.text() : null;
    if (!version) return null;
    return getCacheName(type, version);
}