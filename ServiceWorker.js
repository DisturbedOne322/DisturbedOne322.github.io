const cacheName = "DefaultCompany-Trust Wallet-1.0.0";
const contentToCache = [
    "Build/web.loader.js",
    "Build/web.framework.js.unityweb",
    "Build/web.data.unityweb",
    "Build/web.wasm.unityweb",
    "TemplateData/style.css"
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    // Skip caching for non-GET requests (e.g., POST requests)
    if (e.request.method !== 'GET') {
        console.log(`[Service Worker] Skipping cache for non-GET request: ${e.request.url}`);
        return fetch(e.request); // Simply fetch the request without caching
    }

    e.respondWith((async function () {
        // Try to find the resource in the cache
        let response = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);

        // If the resource is found in the cache, return it
        if (response) {
            console.log(`[Service Worker] Found in cache: ${e.request.url}`);
            return response;
        }

        // If the resource is not in the cache, fetch it from the network
        console.log(`[Service Worker] Fetching from network: ${e.request.url}`);
        response = await fetch(e.request);

        // Cache the new resource
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());

        return response;
    })());
});