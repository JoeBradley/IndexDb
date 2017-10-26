define(["require", "exports", "cc.idb.dbcontext", "jquery"], function (require, exports, cc_idb_dbcontext_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cc;
    (function (cc) {
        var Idb;
        (function (Idb) {
            class SyncService {
                constructor() {
                    this.lastSync = new Date(1970, 1, 1);
                    this.db = new cc_idb_dbcontext_1.DbContext();
                    onmessage = (e) => {
                        console.log('Message received from web worker parent', e);
                        switch (e.data) {
                            case "Sync":
                                this.load();
                                //self.postMessage('DataSync', e.origin);
                                break;
                        }
                    };
                    //console.log(self.location.origin);
                    //console.log(self);
                    //self.postMessage("Loaded", self.location.origin, null);
                    console.log('SyncService Initialized');
                }
                load() {
                    try {
                        $.get('/api/sync', (data, status, xhr) => {
                            this.merge(data);
                        });
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                save(data) {
                    console.log('Save to server');
                    $.post('/api/sync', data, (data, status, xhr) => {
                        console.log('Contact saved');
                    }).fail((xhr, status, error) => {
                        console.error(status);
                    });
                }
                truncateDb() {
                    this.db.contacts.clear();
                    this.db.phones.clear();
                    this.db.emails.clear();
                }
                merge(data) {
                    data.contacts.forEach((contact) => { this.mergeItem(contact, 'contacts'); });
                    data.emails.forEach((email) => { this.mergeItem(email, 'emails'); });
                    data.phoneNumbers.forEach((phone) => { this.mergeItem(phone, 'phones'); });
                }
                mergeItem(item, table) {
                    this.db.table(table).get(item.id)
                        .then((localItem) => {
                        if (item.modified > localItem.modified) {
                            this.db.table(table).put(item);
                        }
                        else {
                            // Local item needs to be synced with server
                        }
                    })
                        .catch(() => {
                        this.db.table(table).add(item);
                    });
                }
            }
            Idb.SyncService = SyncService;
        })(Idb = cc.Idb || (cc.Idb = {}));
    })(cc = exports.cc || (exports.cc = {}));
});
//# sourceMappingURL=cc.idb.syncService.js.map