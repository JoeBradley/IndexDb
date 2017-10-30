try {

    console.log("Worker: Loading");

    self.importScripts('/scripts/require.js');

    require.config({
        baseUrl: "/Scripts",
        paths: {
            "dexie": "dexie/dexie",
            jquery: "jquery/jquery-3.2.1"
        }
    });


    requirejs(
        ['require','jquery','cc.idb.syncService'],
        function (require, $, ss) {
            try {
                console.log("Worker: Create SyncService");

                //console.log($);
                //var s = new ss.Service();

                var service = new ss.cc.Idb.SyncService(self);
                
                console.log("Worker: SyncService created");
            } catch (e) {
                console.warn("Worker: Error creating service");
                console.error(e);
            }
        }, function (e) {
            console.error("Worker: Error loading scripts",e);
            //throw e;
        });

    console.log("Worker: Loaded");
} catch (e) {
    console.warn("Worker: Load Exception");
    console.error(e);
}
