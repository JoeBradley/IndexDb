console.log("Starting");

require.config({
    baseUrl: "/Scripts",
    paths: {
        "dexie": "dexie/dexie",
        jquery: "jquery/jquery-3.2.1"
    }
});

requirejs(['cc.idb.app', 'jquery'], function (cc_idb_app, $) {
    console.log("Start App");
    var main = new cc_idb_app.cc.Idb.App('contacts_list', 'btnRefresh', 'btnAdd');
    main.init();
}, function (e) {
    cosole.warn("Error loading scripts in cc.id.app");
    console.error(e);
    throw e;
});
