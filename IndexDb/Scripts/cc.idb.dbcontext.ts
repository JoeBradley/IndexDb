import Dexie from './typings/dexie/dexie';
import { Contact } from './models/cc.idb.models.contact';
import { IEmailAddress } from './models/cc.idb.models.iemailaddress';
import { IPhoneNumber } from './models/cc.idb.models.iphonenumber';

export class DbContext extends Dexie {

    contacts: Dexie.Table<Contact, number>;
    emails: Dexie.Table<IEmailAddress, number>;
    phones: Dexie.Table<IPhoneNumber, number>;

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

export var db = new DbContext();