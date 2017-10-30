define(["require", "exports", "./cc.idb.dbcontext", "jquery"], function (require, exports, cc_idb_dbcontext_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cc;
    (function (cc) {
        var Idb;
        (function (Idb) {
            /**
             * /@description Sync Service
             */
            class SyncService {
                /**
                 * Web Worker Sync Service
                 * @param {DedicatedWorkerGlobalScope} self - Web Worker global scope for calling self.postMessage()
                 */
                constructor(self) {
                    this.self = self;
                    this.lastSync = new Date(1970, 1, 1);
                    this.db = new cc_idb_dbcontext_1.DbContext();
                    //this.synced = new CustomEvent("synced");
                    //this.syncing = new CustomEvent("syncing");
                    if (typeof this.self !== 'undefined') {
                        this.self.onmessage = (e) => {
                            console.log('Worker: onMessage', e);
                            switch (e.data.action) {
                                case "sync":
                                    this.sync();
                                    break;
                                case "post":
                                    this.sync();
                                    break;
                            }
                        };
                    }
                    //console.log(self.location.origin);
                    //console.log(self);
                    this.self.postMessage({ action: 'ready' });
                    //this.onSynced.bind(this.synced);
                    //self.dispatchEvent(this.synced);
                }
                sync() {
                    try {
                        console.log('SyncService.sync');
                        if (this.self) {
                            this.self.postMessage({ sction: 'syncing' });
                        }
                        $.get('/api/sync', (data, status, xhr) => {
                            this.merge(data);
                            if (this.self) {
                                this.self.postMessage({ sction: 'synced' });
                            }
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