var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./typings/dexie/dexie"], function (require, exports, dexie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Email {
        constructor(email) {
            this.email = email;
        }
    }
    exports.Email = Email;
    class PhoneNumber {
        constructor(phone) {
            this.type = null;
            this.phone = '';
            this.modified = new Date();
            this.timestamp = new Date();
            this.phone = phone;
        }
    }
    exports.PhoneNumber = PhoneNumber;
    /* This is a 'physical' class that is mapped to
        * the contacts table. We can have methods on it that
        * we could call on retrieved database objects.
        */
    class Contact {
        //static tableName: string = "contact";
        //static getSchema(): string {
        //    return "++id, firstName, lastName, profile, modified, timestamp";
        //}
        constructor(first, last, profile, id) {
            this.firstName = first;
            this.lastName = last;
            this.profile = profile;
            if (id)
                this.id = id;
            // Define navigation properties.
            // Making them non-enumerable will prevent them from being handled by indexedDB
            // when doing put() or add().
            Object.defineProperties(this, {
                emails: { value: [], enumerable: false, writable: true },
                phones: { value: [], enumerable: false, writable: true }
            });
        }
        loadNavigationProperties() {
            return __awaiter(this, void 0, void 0, function* () {
                [this.emails, this.phones] = yield Promise.all([
                    exports.db.emails.where('contactId').equals(this.id).toArray(),
                    exports.db.phones.where('contactId').equals(this.id).toArray()
                ]);
            });
        }
        save() {
            return exports.db.transaction('rw', exports.db.contacts, exports.db.emails, exports.db.phones, () => __awaiter(this, void 0, void 0, function* () {
                // Add or update our selves. If add, record this.id.
                this.id = yield exports.db.contacts.put(this);
                this.emails.forEach((email) => { email.contactId = this.id; });
                this.phones.forEach((phone) => { phone.contactId = this.id; });
                // Save all navigation properties (arrays of emails and phones)
                // Some may be new and some may be updates of existing objects.
                // put() will handle both cases.
                // (record the result keys from the put() operations into emailIds and phoneIds
                //  so that we can find local deletes)
                let [emailIds, phoneIds] = yield Promise.all([
                    Promise.all(this.emails.map(email => exports.db.emails.put(email))),
                    Promise.all(this.phones.map(phone => exports.db.phones.put(phone)))
                ]);
                // Was any email or phone number deleted from out navigation properties?
                // Delete any item in DB that reference us, but is not present
                // in our navigation properties:
                yield Promise.all([
                    exports.db.emails.where('contactId').equals(this.id) // references us
                        .and(email => emailIds.indexOf(email.id) === -1) // Not anymore in our array
                        .delete(),
                    exports.db.phones.where('contactId').equals(this.id)
                        .and(phone => phoneIds.indexOf(phone.id) === -1)
                        .delete()
                ]);
            }));
        }
    }
    exports.Contact = Contact;
    class Data {
        constructor() {
            this.emails = [];
            this.phoneNumbers = [];
            this.contacts = [];
        }
    }
    exports.Data = Data;
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
            db.contacts.mapToClass(Contact);
        }
    }
    exports.DbContext = DbContext;
    exports.db = new DbContext();
});
//# sourceMappingURL=cc.idb.dbcontext.js.map