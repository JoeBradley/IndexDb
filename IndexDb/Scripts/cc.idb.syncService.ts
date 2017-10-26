import Dexie from 'typings/dexie/dexie';
import { DbContext } from 'cc.idb.dbcontext';
import { IData, Data } from 'models/cc.idb.models.data';
import { Contact, IEntity } from "models/cc.idb.models.contact";
import { IEmailAddress, EmailAddress } from "models/cc.idb.models.iemailaddress";
import { IPhoneNumber, PhoneNumber } from "models/cc.idb.models.iphonenumber";
import * as $ from "jquery";

export namespace cc.Idb {
    export class SyncService {
        private db: DbContext;
        private lastSync: Date = new Date(1970, 1, 1);

        public loaded: Event;

        constructor() {
            this.db = new DbContext();

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

        private load(): void {
            try {
                $.get('/api/sync', (data, status, xhr) => {
                    this.merge(data);
                });
            } catch (e) {
                console.error(e);
            }
        }

        private save(data: IData): void {
            console.log('Save to server');
            $.post('/api/sync', data, (data, status, xhr) => {
                console.log('Contact saved');
            }).fail((xhr, status, error) => {
                console.error(status);
            });
        }

        private truncateDb(): void {
            this.db.contacts.clear();
            this.db.phones.clear();
            this.db.emails.clear();
        }

        private merge(data: IData): void {
            data.contacts.forEach((contact) => { this.mergeItem<Contact>(contact, 'contacts'); });
            data.emails.forEach((email) => { this.mergeItem<IEmailAddress>(email, 'emails'); });
            data.phoneNumbers.forEach((phone) => { this.mergeItem<IPhoneNumber>(phone, 'phones'); });
        }

        private mergeItem<T extends IEntity>(item: T, table: string): void {
            this.db.table(table).get(item.id)
                .then((localItem: IEntity) => {
                    if (item.modified > localItem.modified) {
                        this.db.table(table).put(item);
                    } else {
                        // Local item needs to be synced with server
                    }
                })
                .catch(() => {
                    this.db.table(table).add(item);
                });
        }
    }
}