/* Cache applicatif versionné pour GitHub Pages et l'usage hors ligne. */
'use strict';

const CACHE_NAME = 'petro-rockeval-shell-v2.0.2';
const APP_SHELL = [
  './',
  './index.html',
  './styles.v2.0.2.css',
  './script.v2.0.2.js',
  './manifest.json',
  './icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(name => name.startsWith('petro-rockeval-shell-') && name !== CACHE_NAME)
        .map(name => caches.delete(name))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    const refresh = fetch(request).then(response => {
      if (response.ok && response.type === 'basic') cache.put(request, response.clone());
      return response;
    }).catch(() => cached || (request.mode === 'navigate' ? cache.match('./index.html') : undefined));
    return cached || await refresh;
  })());
});

