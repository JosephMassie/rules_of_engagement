self.addEventListener('install', (event) => {
    console.log('Service Worker installing.', event);
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.', event);
});

self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
    event.respondWith(fetch(event.request));
});
