import Dexie from '../typings/dexie/dexie';

export interface IEntity {
    id?: number;
    modified: Date;
    timestamp: Date;
}

export interface ITableEntity extends IEntity {
    tableName: string;
    getSchema(): string;
}


export interface IEmailAddress extends IEntity {
    id?: number;
    contactId: number;
    type: string;
    email: string;
    modified: Date;
    timestamp: Date;
}


export interface IPhoneNumber extends IEntity {
    id?: number;
    contactId: number;
    type: string;
    phone: string;
    modified: Date;
    timestamp: Date;
}

export interface IContact extends IEntity {
    firstName: string;
    lastName: string;
    profile: string;

    emails: IEmailAddress[];
    phones: IPhoneNumber[];

    loadNavigationProperties(): Promise<void>;
    save(): Dexie.Promise<void>;
}


export interface IData {
    emails: Array<IEmailAddress>;
    phoneNumbers: Array<IPhoneNumber>;
    contacts: Array<IContact>;
}