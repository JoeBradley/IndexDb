// NOTE: Service Worker Must be in the root of the application, as this sets the scop of the service worker!!!!

// see: https://developers.google.com/web/fundamentals/codelabs/debugging-service-workers/

var oldCacheName: string = 'contactManager-v1';
var cacheName: string = 'contactManager-v1';

// NOTE: Cache file names are case sensitive and must match the request url case exactly
var filesToCache: Array<string> = [
    '/',
    'index.html',

    'scripts/require.js',
    
    'scripts/r.js',
    'scripts/dexie/dexie.js',
    'scripts/jquery/jquery-3.2.1.js',

    'cc.idb.main.js',
    'Scripts/cc.idb.app.js',
    'Scripts/cc.idb.dbcontext.js',
    'Scripts/cc.idb.startup.js',
    'Scripts/cc.idb.syncService.js',
    'Scripts/cc.idb.ww.js',
    'Scripts/models/cc.idb.model.js',

    'Content/styles.css',

    'Images/icons/monkey_32.png',
    'Images/icons/monkey_128.png',
    'images/icons/monkey_144.png',
    'Images/Profiles/Chris.jpg',
    'Images/profiles/Anna.jpg',
    'Images/loading.gif',
    'Images/ic_add_white_24px.svg',
    'Images/ic_refresh_white_24px.svg'
];

self.addEventListener('install', function (e: any) {
    console.log('[ServiceWorker] Install');

    try {
        //e.waitUntil(caches.delete(this.cacheName));

        e.waitUntil(
            caches
                .open(cacheName)
                .then((cache) => {
                    try {
                        console.log('[ServiceWorker] Caching app files: \n' + JSON.stringify(filesToCache));
                        return cache.addAll(filesToCache);
                    } catch (e) {
                        console.error('[ServiceWorker] Failed to init cache ' + cacheName,e);
                    }
                }).then(function () {
                    console.log('[ServiceWorker] Install completed');
                })
        );
    }
    catch (e) {
        console.error("[ServiceWorker] Fetch error", e);
    }
});

self.addEventListener('activate', function (e: any) {
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

self.addEventListener('fetch', function (e: any) {

    try {
        //console.log('[Service Worker] Fetch', e.request.url);

        /*
         * The app is asking for app shell files. In this scenario the app uses the
         * "Cache, falling back to the network" offline strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
         */
        e.respondWith(
            caches
                .match(e.request)
                .then(function(response) {
                    if (response) {
                        console.log('[ServiceWorker] Returning cached data for request', e.request.url);
                        return response;
                    }

                    console.warn('[ServiceWorker] No cahced data for request', e.request.url);

                    return fetch(e.request);
                }, (reason) => { console.error('Cache fetch failed', reason); })
        );
    }
    catch (e) {
        console.error("[ServiceWorker] Fetch error", e);
    }
});
