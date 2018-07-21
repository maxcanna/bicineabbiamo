/* eslint-env serviceworker, browser */
self.addEventListener('install', event =>
    event.waitUntil(
        caches.open('cache')
            .then(cache => cache.addAll(['/', 'images/touch/launcher-icon-4x.png']))
            .then(() => self.skipWaiting())
    ));

self.addEventListener('fetch', event =>
    event.respondWith(
        caches.match(event.request)
            .then(response => fetch(event.request).catch(() => response))
    ));
