// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cc;
    (function (cc) {
        var idb;
        (function (idb) {
            class AppServiceWorker {
                /**
                 * Web Worker Sync Service
                 * @param {ServiceWorkerGlobalScope} self - Servce Worker global scope (not window)
                 */
                constructor(self) {
                    this.self = self;
                    this.dataCacheName = 'contactManagerData-v1';
                    this.cacheName = 'contactManager-v1';
                    this.filesToCache = [
                        '/index.html',
                        '/scripts/dexie/dexie.js',
                        '/scripts/jquery/jquery-3.2.1.js',
                        '/scripts/require.js',
                        '/scripts/cc.idb.app.js',
                        '/scripts/cc.idb.dbcontext.js',
                        '/scripts/cc.idb.startup.js',
                        '/scripts/cc.idb.syncService.js',
                        '/scripts/cc.idb.ww.js',
                        '/scripts/models/',
                        '/content/styles.css',
                        '/images/icons',
                        '/images/profiles',
                        '/images/loading.gif',
                        '/images/ic_add_white_24px.svg',
                        '/images/ic_refresh_white_24px.svg',
                    ];
                    this.bindEventListeners();
                }
                bindEventListeners() {
                    this.self.addEventListener('install', (e) => {
                        console.log('[ServiceWorker] Install');
                        e.waitUntil(caches.open(this.cacheName).then(function (cache) {
                            console.log('[ServiceWorker] Caching app shell file: \n' + JSON.stringify(this.filesToCache));
                            return cache.addAll(this.filesToCache);
                        }));
                    });
                    this.self.addEventListener('activate', (e) => {
                        console.log('[ServiceWorker] Activate');
                        e.waitUntil(caches.keys().then(function (keyList) {
                            return Promise.all(keyList.map(function (key) {
                                if (key !== this.cacheName && key !== this.dataCacheName) {
                                    console.log('[ServiceWorker] Removing old cache', key);
                                    return caches.delete(key);
                                }
                            }));
                        }));
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
                    this.self.addEventListener('fetch', (e) => {
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
                            e.respondWith(caches.open(this.dataCacheName).then(function (cache) {
                                return fetch(e.request).then(function (response) {
                                    cache.put(e.request.url, response.clone());
                                    return response;
                                });
                            }));
                        }
                        else {
                            /*
                             * The app is asking for app shell files. In this scenario the app uses the
                             * "Cache, falling back to the network" offline strategy:
                             * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
                             */
                            e.respondWith(caches.match(e.request).then(function (response) {
                                return response || fetch(e.request);
                            }));
                        }
                    });
                }
            }
            idb.AppServiceWorker = AppServiceWorker;
        })(idb = cc.idb || (cc.idb = {}));
    })(cc = exports.cc || (exports.cc = {}));
    exports.serviceWorker = new cc.idb.AppServiceWorker(self);
});
//# sourceMappingURL=cc.idb.serviceWorker.js.map