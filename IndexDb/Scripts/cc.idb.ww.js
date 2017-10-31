try {

    console.log("Worker: Loading");

    self.importScripts('/scripts/require.js');
    
    requirejs.config({
        baseUrl: "/Scripts",
        paths: {
            "dexie": "dexie/dexie"
        }
    });


    requirejs(
        ['require','cc.Idb.SyncService'],
        function (require, ss) {
            try {
                console.log("Worker: Create SyncService");

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
