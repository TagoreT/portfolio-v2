/* global self */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `portfolio-shell-${CACHE_VERSION}`;

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/site-config.js',
  '/assets/js/random-avatar.js',
  '/assets/js/github-activity.js',
  '/assets/js/profile-context.js',
  '/assets/js/portfolio-context.js',
  '/assets/js/script.js',
  '/data/profile-context.json',
  '/data/profile-context.data.js',
  '/assets/images/logo.ico',
  '/assets/images/my-avatar.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const isNavigationRequest = (request) => request.mode === 'navigate';
const isSameOrigin = (url) => url.origin === self.location.origin;

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (!isSameOrigin(url)) return;

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html')),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    }),
  );
});

