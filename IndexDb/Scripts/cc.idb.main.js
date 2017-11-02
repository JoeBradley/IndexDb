if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/Scripts/cc.idb.sw.js')
        .then(function (registration) { console.log('Service Worker Registered'); })
        .catch(function (reason) { console.error('Failed to attach service worker', reason) });
}