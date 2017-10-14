define(["require", "exports", "./cc.idb.dbcontext"], function (require, exports, cc_idb_dbcontext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cc;
    (function (cc) {
        var Idb;
        (function (Idb) {
            class App {
                constructor(containerId) {
                    this.containerId = containerId;
                    this.lastSync = new Date(1970, 1, 1);
                    console.log("App cntr");
                    this.db = new cc_idb_dbcontext_1.DbContext();
                }
                init() {
                    this.sync();
                }
                sync() {
                    $.get('/api/sync', (data, status, xhr) => {
                        console.log(data);
                        this.merge(data);
                        this.rebind();
                    });
                }
                merge(data) {
                    data.contacts.forEach((contact) => { this.db.contacts.put(contact); });
                    data.emails.forEach((email) => { this.db.emails.put(email); });
                    data.phoneNumbers.forEach((phone) => { this.db.phones.put(phone); });
                }
                rebind() {
                    $('#' + this.containerId).html('');
                    this.db.contacts.each((item, cursor) => {
                        console.log(item);
                        $('#' + this.containerId).append('<div>' + item.firstName + '</div>');
                    });
                }
            }
            Idb.App = App;
        })(Idb = cc.Idb || (cc.Idb = {}));
    })(cc = exports.cc || (exports.cc = {}));
});
//export var app = new cc.Idb.App(""); 
//# sourceMappingURL=cc.idb.app.js.map