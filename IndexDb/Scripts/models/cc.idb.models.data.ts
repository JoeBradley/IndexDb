import { IEmailAddress } from "./cc.idb.models.iemailaddress"
import { IPhoneNumber } from "./cc.idb.models.iphonenumber"
import { Contact } from "./cc.idb.models.contact"

export interface IData {
    emails: Array<IEmailAddress>;
    phoneNumbers: Array<IPhoneNumber>;
    contacts: Array<Contact>;
}