import Dexie from './typings/dexie/dexie';
import { DbContext } from './cc.idb.dbcontext';
import { IData } from './models/cc.idb.models.data';
import { Contact } from "./models/cc.idb.models.contact";

export namespace cc.Idb {
    export class App {
        private db: DbContext;
        private lastSync: Date = new Date(1970, 1, 1);

        constructor(private containerId: string) {
            console.log("App cntr");
            this.db = new DbContext();
        }
        
        public init(): void {
            this.sync();
        }

        private sync(): void {
            $.get('/api/sync', (data, status, xhr) => {
                console.log(data);

                this.merge(data);
                this.rebind();
            });
        }
        
        private merge(data: IData): void {
            data.contacts.forEach((contact) => { this.db.contacts.put(contact); });
            data.emails.forEach((email) => { this.db.emails.put(email); });
            data.phoneNumbers.forEach((phone) => { this.db.phones.put(phone); });
        }

        private rebind(): void {
            $('#' + this.containerId).html('');
            this.db.contacts.each((item: Contact, cursor) => {
                console.log(item);
                $('#' + this.containerId).append('<div>' + item.firstName + '</div>');
            });
        }
    }
}

//export var app = new cc.Idb.App("");