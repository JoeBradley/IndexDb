import { IEntity } from "./cc.idb.models.contact";

export interface IPhoneNumber extends IEntity {
    id?: number;
    contactId: number;
    type: string;
    phone: string;
    modified: Date;
    timestamp: Date;
}

export class PhoneNumber implements IPhoneNumber {
    id?: number;
    contactId: number;
    type: string = null;
    phone: string = '';
    modified: Date = new Date();
    timestamp: Date = new Date();

    constructor(phone: string){
        this.phone = phone;
    }
}