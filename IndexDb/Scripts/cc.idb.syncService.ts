import Dexie from "./typings/dexie/dexie";
import { DbContext } from './cc.idb.dbcontext';
import * as model from "./models/cc.idb.model";
import * as $ from 'jquery';

export namespace cc.Idb {

    export interface ISyncService {
        syncing: CustomEvent;
        synced: CustomEvent;
        sync(): void;
    }

    /**
     * /@description Sync Service
     */
    export class SyncService implements ISyncService {

        private db: DbContext;
        private lastSync: Date = new Date(1970, 1, 1);

        public synced: CustomEvent;
        public syncing: CustomEvent;

        /**
         * Web Worker Sync Service
         * @param {DedicatedWorkerGlobalScope} self - Web Worker global scope for calling self.postMessage()
         */
        constructor(private self?: any) {
            this.db = new DbContext();

            //this.synced = new CustomEvent("synced");
            //this.syncing = new CustomEvent("syncing");

            if (typeof this.self !== 'undefined') {
                this.self.onmessage = (e: MessageEvent) => {
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

            this.self.postMessage({action:'ready'});

            //this.onSynced.bind(this.synced);

            //self.dispatchEvent(this.synced);
        }

        public sync(): void {
            try {
                console.log('SyncService.sync');

                if (this.self) { this.self.postMessage({ sction: 'syncing' }); }

                $.get('/api/sync', (data, status, xhr) => {
                    this.merge(data);
                    if (this.self) { this.self.postMessage({ sction: 'synced' }); }
                });
            } catch (e) {
                console.error(e);
            }
        }

        private save(data: model.IData): void {
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

        private merge(data: model.IData): void {
            data.contacts.forEach((contact) => { this.mergeItem<model.IContact>(contact, 'contacts'); });
            data.emails.forEach((email) => { this.mergeItem<model.IEmailAddress>(email, 'emails'); });
            data.phoneNumbers.forEach((phone) => { this.mergeItem<model.IPhoneNumber>(phone, 'phones'); });
        }

        private mergeItem<T extends model.IEntity>(item: T, table: string): void {
            this.db.table(table).get(item.id)
                .then((localItem: model.IEntity) => {
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