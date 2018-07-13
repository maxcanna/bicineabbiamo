/* eslint-env serviceworker, browser */
self.addEventListener('install', event =>
    event.waitUntil(
        caches.open('cache')
            .then(cache => cache.addAll(['/', 'images/touch/launcher-icon-4x.png']))
            .then(() => self.skipWaiting())
    ));

self.addEventListener('fetch', ({ request }) =>
    event.respondWith(
        caches.match(request)
            .then(response => fetch(request).catch(() => response))
    ));
