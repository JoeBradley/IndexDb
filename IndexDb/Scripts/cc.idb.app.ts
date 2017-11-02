import * as $ from "jquery";
import Dexie from 'typings/dexie/dexie';
import * as model from './cc.idb.dbcontext';

export namespace cc.Idb {
    export class App {
        private db: model.DbContext;
        private lastSync: Date = new Date(1970, 1, 1);
        private syncServiceWorker: Worker = null;

        constructor(private containerId: string, private btnRefreshId: string, private btnAddId: string) {
            this.db = new model.DbContext();
            this.createSyncServiceWorker();
            this.bindUi();
        }

        public init(): void {
            this.bind();

            this.rebind()
                .then(() => {
                    //console.log('then');
                })
                .finally(() => {
                    if (this.syncServiceWorker === null)
                        this.initPeriodicSync();
                });
        }

        private bindUi(): void {
            $('#' + this.btnAddId).click((e) => { });
            $('#' + this.btnRefreshId).click((e) => { this.sync(); });
        }

        private initPeriodicSync(): void {
            window.setInterval(() => {
                console.log('Periodic sync');
                this.sync();
            }, 10000);
        }

        private createSyncServiceWorker(): void {
            try {
                this.syncServiceWorker = new Worker('/scripts/cc.idb.ww.js');

                this.syncServiceWorker.onmessage = (e: MessageEvent) => {
                    console.log('UI.onMessage', e);

                    switch (e.data.action) {
                        case 'ready':
                            this.sync();
                            this.initPeriodicSync();
                            break;
                        case 'synced':
                            this.rebind();
                            $('#loading').hide();
                            break;
                        case 'syncing':
                            $('#loading').show();
                            //this.sync();
                            break;
                    }
                }

                this.syncServiceWorker.onerror = (e) => {
                    console.error('UI.onError', e);
                }
            } catch (e) {
                console.error('createSyncServiceWorker.error', e);
            }
        }

        private sync(): void {
            console.log('app.sync. method: ' + (this.syncServiceWorker !== null ? 'webworker' : 'ajax'));
            
            if (this.syncServiceWorker !== null) {
                var message = { action: 'sync' };
                console.log('UI.postMessage', message);
                this.syncServiceWorker.postMessage(message);
            }
            else {
                var self = this;
                $.get('/api/sync', (data, status, xhr) => {
                    self.merge(data);
                    self.rebind();
                });
            }
        }

        private post(data: model.IData): void {
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
                var contact = new model.Contact($('#txtFirstName').val(), $('#txtLastName').val(), $('#txtProfile').val(), id);

                var emails = $('#txtEmails').val().split('\n');
                contact.emails = emails.map((email) => { return new model.Email(email); });

                var phones = $('#txtPhones').val().split('\n');
                contact.phones = phones.map((phone) => { return new model.PhoneNumber(phone); });

                console.log("New Contact:");
                console.log(contact);

                contact.save();

                var data = new model.Data();
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
            return this.db.contacts.each((item: model.IContact, cursor) => {
                item.loadNavigationProperties().then(() => {
                    
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
