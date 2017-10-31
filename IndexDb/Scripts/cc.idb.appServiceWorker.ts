namespace cc.idb {
    class AppServiceWorker {

        dataCacheName: string = 'contactManagerData-v1';
        cacheName: string = 'contactManager-v1';
        filesToCache: Array<string> = [
            '/index.html',
            '/scripts/dexie/dexie.js',
            '/scripts/jquery/jquery-3.2.1.js',
            '/scripts/require.js',
            '/scripts/cc.idb.app.js',
            '/scripts/cc.idb.dbcontext.js',
            '/scripts/cc.idb.startup.js',
            '/scripts/cc.idb.syncService.js',
            '/scripts/cc.idb.ww.js',
            '/scripts/models/cc.idb.model.js',
            '/content/styles.css',
            '/images/icons/monkey_32.png',
            '/images/icons/monkey_128.png',
            '/images/profiles/Chris.jpg',
            '/images/profiles/Anna.jpg',
            '/images/loading.gif',
            '/images/ic_add_white_24px.svg',
            '/images/ic_refresh_white_24px.svg',
        ];

        /**
         * Web Worker Sync Service
         * @param {ServiceWorkerGlobalScope} self - Servce Worker global scope (not window)
         */
        constructor(private self: any) {
            this.bindEventListeners();
        }

        private bindEventListeners() {
            var _that = this;
            this.self.addEventListener('install', (e : any) => {
                console.log('[ServiceWorker] Install');
                e.waitUntil(
                    caches.open(this.cacheName).then((cache) => {
                        console.log('[ServiceWorker] Caching app shell file: \n' + JSON.stringify(this.filesToCache));
                        return cache.addAll(this.filesToCache);
                    })
                );
            });

            this.self.addEventListener('activate', (e: any) => {
                console.log('[ServiceWorker] Activate');
                var _that = this;
                e.waitUntil(
                    caches.keys().then(function (keyList) {
                        return Promise.all(keyList.map((key) => {
                            if (key !== this.cacheName && key !== this.dataCacheName) {
                                console.log('[ServiceWorker] Removing old cache', key);
                                return caches.delete(key);
                            }
                        }));
                    })
                );
                /*
                 * Fixes a corner case in which the app wasn't returning the latest data.
                 * You can reproduce the corner case by commenting out the line below and
                 * then doing the following steps: 1) load app for first time so that the
                 * initial New York City data is shown 2) press the refresh button on the
                 * app 3) go offline 4) reload the app. You expect to see the newer NYC
                 * data, but you actually see the initial data. This happens because the
                 * service worker is not yet activated. The code below essentially lets
                 * you activate the service worker faster.
                 */
                return this.self.clients.claim();
            });

            this.self.addEventListener('fetch', (e : any) => {
                console.log('[Service Worker] Fetch', e.request.url);
                var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
                if (e.request.url.indexOf(dataUrl) > -1) {
                    /*
                     * When the request URL contains dataUrl, the app is asking for fresh
                     * weather data. In this case, the service worker always goes to the
                     * network and then caches the response. This is called the "Cache then
                     * network" strategy:
                     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
                     */
                    e.respondWith(
                        caches.open(this.dataCacheName).then(function (cache) {
                            return fetch(e.request).then(function (response) {
                                cache.put(e.request.url, response.clone());
                                return response;
                            });
                        })
                    );
                } else {
                    /*
                     * The app is asking for app shell files. In this scenario the app uses the
                     * "Cache, falling back to the network" offline strategy:
                     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
                     */
                    e.respondWith(
                        caches.match(e.request).then(function (response) {
                            return response || fetch(e.request);
                        })
                    );
                }
            });
        }
    }

    const serviceWorker = new AppServiceWorker(self);
}

