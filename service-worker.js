const CACHE_NAME = "guia-andrelandia-v1";

const FILES_TO_CACHE = [

    "./",
    "./index.html",

    "./style.css",

    "./manifest.json",

    "./js/script.js",
    "./js/map.js",
    "./js/local.js",
    "./js/gallery.js",

    "./css/local.css",

    "./pages/local.html",

    "./data/locais.json",
    "./data/mapa.geojson",

    "./icons/icon-192.png",
    "./icons/icon-512.png",

    "https://unpkg.com/leaflet/dist/leaflet.css",
    "https://unpkg.com/leaflet/dist/leaflet.js"

];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(FILES_TO_CACHE);

            })

    );

});

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            return caches.delete(key);

                        }

                    })

                );

            })

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(response => {

                return response || fetch(event.request);

            })

    );

});