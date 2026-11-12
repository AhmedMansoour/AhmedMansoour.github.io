/* My Adhkar: only app-shell files are cached. All progress stays in browser localStorage. */
const CACHE_NAME = 'my-adhkar-pwa-v1-20261112';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('my-adhkar-pwa-') && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if(url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  if(event.request.mode === 'navigate'){
    event.respondWith(fetch(event.request).then(response => {
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy)));}
      return response;
    }).catch(async()=> (await caches.match('./index.html')) || Response.error()));
  } else {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)));}
      return response;
    })));
  }
});