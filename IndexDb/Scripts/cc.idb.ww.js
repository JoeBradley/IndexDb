console.log("Web Worker Loaded");

self.importScripts('/scripts/require.js');

try {
    require.config({
        baseUrl: "http://localhost:50821/Scripts",
        paths: {
            "dexie": "dexie/dexie",
            "jquery": "jquery/jquery-3.2.1"
        }
    });

    requirejs(['cc.idb.syncService'], function (ss) {
        console.log("Create SyncService");

        var service = new ss.cc.Idb.SyncService();

        self.postMessage('loaded');

        console.log("SyncService created");
    });
} catch (e) {
    console.error(e);
}
