console.log("Starting");

require.config({
    baseUrl: "/scripts",
    paths: {
        "dexie": "dexie/dexie",
        "jquery": "jquery/jquery-3.2.1"
    }
});

requirejs(['cc.idb.app','jquery'], function (cc_idb_app, $) {
    console.log("Start App");
    var main = new cc_idb_app.cc.Idb.App("contacts_list");
    main.init();
});
