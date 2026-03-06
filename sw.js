var CACHE = "cameras-v3";
var SHELL = ["/", "/manifest.json", "/icon.svg"];

self.addEventListener("install", function(e) {
    e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(SHELL); }));
    self.skipWaiting();
});

self.addEventListener("activate", function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", function(e) {
    var url = new URL(e.request.url);
    if (url.pathname.indexOf("/api/") === 0) return;
    e.respondWith(
        fetch(e.request).then(function(r) {
            var clone = r.clone();
            caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
            return r;
        }).catch(function() { return caches.match(e.request); })
    );
});
