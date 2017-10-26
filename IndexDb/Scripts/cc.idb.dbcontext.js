define(["require", "exports", "./typings/dexie/dexie", "./models/cc.idb.models.contact"], function (require, exports, dexie_1, cc_idb_models_contact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DbContext extends dexie_1.default {
        constructor() {
            super("cc_idb");
            var db = this;
            //
            // Define tables and indexes
            //
            db.version(1).stores({
                contacts: '++id, firstName, lastName, profile, timestamp, modified',
                emails: '++id, contactId, type, email, timestamp, modified',
                phones: '++id, contactId, type, phone, timestamp, modified',
            });
            // Let's physically map Contact class to contacts table.
            // This will make it possible to call loadEmailsAndPhones()
            // directly on retrieved database objects.
            db.contacts.mapToClass(cc_idb_models_contact_1.Contact);
        }
    }
    exports.DbContext = DbContext;
    exports.db = new DbContext();
});
//# sourceMappingURL=cc.idb.dbcontext.js.map