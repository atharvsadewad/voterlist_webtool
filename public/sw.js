self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
});

// Basic caching (static assets)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("v1").then((cache) =>
      cache.match(event.request).then((res) => {
        return (
          res ||
          fetch(event.request).then((fetchRes) => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          })
        );
      })
    )
  );
});
