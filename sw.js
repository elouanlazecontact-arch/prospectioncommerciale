/* Radar — fonctionnement hors ligne : l'appli s'ouvre même sans réseau. */
const V = 'radar-v61';
const SHELL = ['./', 'index.html', 'pc.html', 'mobile.html', 'app.css', 'app.js', 'config.js',
  'manifest-pc.webmanifest', 'manifest-mobile.webmanifest',
  'pc-192.png', 'pc-512.png', 'mobile-192.png', 'mobile-512.png', 'lib/xlsx.full.min.js', 'lib/exceljs.min.js', 'lib/tiles.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const cdn = /cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(url.host);
  if (!sameOrigin && !cdn) return; // API : toujours en direct
  if (sameOrigin) { // réseau d'abord, cache en secours
    e.respondWith(fetch(req,{cache:'no-cache'}).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(req, c)); return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
  } else { // librairies et polices : cache d'abord
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(req, c)); return res; })));
  }
});

/* Clic sur une notification de rappel : ramène Radar au premier plan sur la bonne fiche */
self.addEventListener('notificationclick', e => {
  e.notification.close(); const d = e.notification.data || {};
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => /pc\.html|mobile\.html/.test(x.url)) || cs[0];
    if (c) { if (d.id) c.postMessage({ type: 'fiche', id: d.id }); return c.focus(); }
    return self.clients.openWindow(d.url || './');
  }));
});
