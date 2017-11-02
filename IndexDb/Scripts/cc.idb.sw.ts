
var oldCacheName: string = 'contactManager-v1';
var cacheName: string = 'contactManager-v1';

var filesToCache: Array<string> = [
    '/',
    '/index.html',

    '/scripts/require.js',
    '/scripts/r.js',
    '/scripts/dexie/dexie.js',
    '/scripts/jquery/jquery-3.2.1.js',

    '/scripts/cc.idb.main.js',
    '/scripts/cc.idb.app.js',
    '/scripts/cc.idb.dbcontext.js',
    '/scripts/cc.idb.startup.js',
    '/scripts/cc.idb.syncService.js',
    '/scripts/cc.idb.ww.js',
    '/scripts/models/cc.idb.model.js',

    '/content/styles.css',

    '/images/icons/monkey_32.png',
    '/images/icons/monkey_128.png',
    '/images/icons/monkey_144.png',
    '/images/profiles/Chris.jpg',
    '/images/profiles/Anna.jpg',
    '/images/loading.gif',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg'
];

this.self.addEventListener('install', (e: any) => {
    console.log('[ServiceWorker] Install');

    try {
        //e.waitUntil(caches.delete(this.cacheName));

        e.waitUntil(
            caches
                .open(this.cacheName)
                .then((cache) => {
                    console.log('[ServiceWorker] Caching app shell file: \n' + JSON.stringify(this.filesToCache));
                    return cache.addAll(this.filesToCache);
                })
                .catch((reason: any) => { console.warn('ServiceWorker.addEventListener install failed', reason); })
        );
    }
    catch (e) {
        console.error("[ServiceWorker] Fetch error", e);
    }
});

this.self.addEventListener('activate', (e: any) => {
    console.log('[ServiceWorker] Activate');
    //var _that = this;
    //e.waitUntil(
    //    caches.keys()
    //        .then(function (keyList) {
    //            return Promise.all(keyList.map((key) => {
    //                if (_that.cacheName !== _that.oldCacheName && 
    //                    key !== _that.cacheName && key !== _that.oldCacheName) {
    //                    console.log('[ServiceWorker] Removing old cache', key);
    //                    return caches.delete(key);
    //                }
    //            }));
    //        })
    //        .catch((reason: any) => { console.warn('ServiceWorker.addEventListener activate failed', reason); })

    //);
    //return this.self.clients.claim();
});

this.self.addEventListener('fetch', (e: any) => {

    try {
        console.log('[Service Worker] Fetch', e.request.url);

        /*
         * The app is asking for app shell files. In this scenario the app uses the
         * "Cache, falling back to the network" offline strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
         */
        e.respondWith(
            caches
                .match(e.request)
                .then((response) => {
                    if (response) {
                        console.log('[ServiceWorker] Returning cached data for request', e.request);
                        return response;
                    }

                    console.log('[ServiceWorker] No cahced data for request', e.request);

                    return fetch(e.request);
                })
                .catch((reason) => { console.warn('Cache fetch failed', reason); })
        );
    }
    catch (e) {
        console.error("[ServiceWorker] Fetch error", e);
    }
});
