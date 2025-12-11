const CACHE_NAME = "app-cache-v3"; // bump version anytime you want to force update

// Install immediately
self.addEventListener("install", (e) => {
  self.skipWaiting();
});

// Activate and delete old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for images (fixes your hero issue)
self.addEventListener("fetch", (e) => {
  const req = e.request;

  // Handle images with ALWAYS network-first
  if (req.destination === "image") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req)) // fallback if offline
    );
    return;
  }

  // Default strategy: cache-first fallback
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
