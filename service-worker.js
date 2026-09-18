const CACHE_NAME = "fitness-cache-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./app.jsx",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Réseau d'abord pour les fichiers locaux : la dernière version en ligne est toujours utilisée
  // quand la connexion est disponible ; le cache ne sert que si le réseau échoue (mode hors ligne).
  const url = event.request.url;
  const isLocal = url.startsWith(self.location.origin);

  if (!isLocal) return; // laisse le navigateur gérer les CDN normalement (React, Babel, Supabase...)

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
