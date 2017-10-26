define(["require", "exports", "./cc.idb.dbcontext", "./models/cc.idb.models.data", "./models/cc.idb.models.contact", "./models/cc.idb.models.iemailaddress", "./models/cc.idb.models.iphonenumber", "jquery"], function (require, exports, cc_idb_dbcontext_1, cc_idb_models_data_1, cc_idb_models_contact_1, cc_idb_models_iemailaddress_1, cc_idb_models_iphonenumber_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cc;
    (function (cc) {
        var Idb;
        (function (Idb) {
            class App {
                constructor(containerId) {
                    this.containerId = containerId;
                    this.lastSync = new Date(1970, 1, 1);
                    this.syncServiceWorker = null;
                    console.log("App cntr");
                    this.db = new cc_idb_dbcontext_1.DbContext();
                    this.createSyncServiceWorker();
                }
                init() {
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
                createSyncServiceWorker() {
                    try {
                        this.syncServiceWorker = new Worker('/scripts/cc.idb.ww.js');
                        this.syncServiceWorker.onmessage = (e) => {
                            console.log('Message received from worker: ');
                            console.log(e);
                            this.sync();
                        };
                        this.syncServiceWorker.onerror = (e) => {
                            console.error(e);
                        };
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                sync() {
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
                        var contact = new cc_idb_models_contact_1.Contact($('#txtFirstName').val(), $('#txtLastName').val(), $('#txtProfile').val(), id);
                        var emails = $('#txtEmails').val().split('\n');
                        contact.emails = emails.map((email) => { return new cc_idb_models_iemailaddress_1.EmailAddress(email); });
                        var phones = $('#txtPhones').val().split('\n');
                        contact.phones = phones.map((phone) => { return new cc_idb_models_iphonenumber_1.PhoneNumber(phone); });
                        console.log("New Contact:");
                        console.log(contact);
                        contact.save();
                        var data = new cc_idb_models_data_1.Data();
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
            Idb.App = App;
        })(Idb = cc.Idb || (cc.Idb = {}));
    })(cc = exports.cc || (exports.cc = {}));
});
//# sourceMappingURL=cc.idb.app.js.map