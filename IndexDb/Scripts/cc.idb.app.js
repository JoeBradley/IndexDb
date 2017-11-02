define(["require", "exports", "jquery", "./cc.idb.dbcontext"], function (require, exports, $, model) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cc;
    (function (cc) {
        var Idb;
        (function (Idb) {
            class App {
                constructor(containerId, btnRefreshId, btnAddId) {
                    this.containerId = containerId;
                    this.btnRefreshId = btnRefreshId;
                    this.btnAddId = btnAddId;
                    this.lastSync = new Date(1970, 1, 1);
                    this.syncServiceWorker = null;
                    this.db = new model.DbContext();
                    this.createSyncServiceWorker();
                    this.bindUi();
                }
                init() {
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
                bindUi() {
                    $('#' + this.btnAddId).click((e) => { });
                    $('#' + this.btnRefreshId).click((e) => { this.sync(); });
                }
                initPeriodicSync() {
                    window.setInterval(() => {
                        console.log('Periodic sync');
                        this.sync();
                    }, 10000);
                }
                createSyncServiceWorker() {
                    try {
                        this.syncServiceWorker = new Worker('/scripts/cc.idb.ww.js');
                        this.syncServiceWorker.onmessage = (e) => {
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
                        };
                        this.syncServiceWorker.onerror = (e) => {
                            console.error('UI.onError', e);
                        };
                    }
                    catch (e) {
                        console.error('createSyncServiceWorker.error', e);
                    }
                }
                sync() {
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
                post(data) {
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
                bind() {
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
                rebind() {
                    $('#' + this.containerId).html('');
                    return this.db.contacts.each((item, cursor) => {
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
            Idb.App = App;
        })(Idb = cc.Idb || (cc.Idb = {}));
    })(cc = exports.cc || (exports.cc = {}));
});
//# sourceMappingURL=cc.idb.app.js.map