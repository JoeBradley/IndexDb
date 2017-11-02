if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('cc.idb.sw.js')
        .then(function (registration) {
            console.log('Service Worker Registered', registration);
        },
        function (reason) { console.error('Failed to attach service worker', reason) });
}