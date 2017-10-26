import Dexie from './typings/dexie/dexie';
import { DbContext } from './cc.idb.dbcontext';
import { IData, Data } from './models/cc.idb.models.data';
import { Contact, IEntity } from "./models/cc.idb.models.contact";
import { IEmailAddress, EmailAddress } from "./models/cc.idb.models.iemailaddress";
import { IPhoneNumber, PhoneNumber } from "./models/cc.idb.models.iphonenumber";
import * as $ from "jquery";

export namespace cc.Idb {
    export class App {
        private db: DbContext;
        private lastSync: Date = new Date(1970, 1, 1);
        private syncServiceWorker: Worker = null;

        constructor(private containerId: string) {
            console.log("App cntr");
            this.db = new DbContext();
            this.createSyncServiceWorker();
        }

        public init(): void {
            this.bind();
            this.rebind()
                .then(() => {
                    //console.log('then');
                })
                .finally(() => {
                    //console.log('finally');
                    this.sync();
                });
        }

        private createSyncServiceWorker(): void {
            try {
                this.syncServiceWorker = new Worker('/scripts/cc.idb.ww.js');
                this.syncServiceWorker.onmessage = (e) => {
                    console.log('Message received from worker: ')
                    console.log(e);
                    this.sync();
                }
                this.syncServiceWorker.onerror = (e) => {
                    console.error(e);
                }
            } catch (e) {
                console.error(e);
            }
        }

        private sync(): void {
            console.log('Sync');

            if (this.syncServiceWorker) {
                console.log('Post message to SyncService');
                this.syncServiceWorker.postMessage('Sync');
            }
            else {
                $.get('/api/sync', (data, status, xhr) => {
                    this.merge(data);
                    this.rebind();
                });
            }
        }

        private post(data: IData): void {
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

        private bind(): void {
            $('#btnAdd').click(() => {
                $('#txtId').val(0);
                $('#txtFirstName').val('');
                $('#txtLastName').val('');
                $('#txtProfile').val('');
                $('#txtEmails').val('');
                $('#txtPhones').val('');

                $('#dialog').toggleClass('dialog-container--visible');
            });
            $('#btnSave').click(() => {
                var id = parseInt($('#txtId').val());
                var contact = new Contact($('#txtFirstName').val(), $('#txtLastName').val(), $('#txtProfile').val(), id);

                var emails = $('#txtEmails').val().split('\n');
                contact.emails = emails.map((email) => { return new EmailAddress(email); });

                var phones = $('#txtPhones').val().split('\n');
                contact.phones = phones.map((phone) => { return new PhoneNumber(phone); });

                console.log("New Contact:");
                console.log(contact);

                contact.save();

                var data = new Data();
                data.contacts.push(contact);
                data.emails = contact.emails;
                data.phoneNumbers = contact.phones;

                this.post(data);

                this.rebind();

                $('#dialog').toggleClass('dialog-container--visible');
            });
            $('#btnCancel').click(() => { $('#dialog').toggleClass('dialog-container--visible'); });
        }

        private rebind(): Dexie.Promise<void> {
            $('#' + this.containerId).html('');
            return this.db.contacts.each((item: Contact, cursor) => {
                item.loadNavigationProperties().then(() => {
                    console.log(item);

                    $('#contact_template .contact_firstname').html(item.firstName);
                    $('#contact_template .contact_lastname').html(item.lastName);
                    $('#contact_template .contact_profile').css({ "background-image": "url('" + item.profile + "'" });

                    $('#contact_template .contact_email').html(item.emails[0].email);
                    $('#contact_template .contact_phone').html(item.phones[0].phone);

                    $('#contact_template .card').clone().appendTo('#' + this.containerId).attr('data-id', item.id.toString());
                });
            });
        }
    }
}
