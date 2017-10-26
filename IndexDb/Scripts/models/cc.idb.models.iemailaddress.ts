/* Just for code completion and compilation - defines
    * the interface of objects stored in the emails table.
    */
import { IEntity } from "./cc.idb.models.contact";

export interface IEmailAddress extends IEntity {
    id?: number;
    contactId: number;
    type: string;
    email: string;
    modified: Date;
    timestamp: Date;
}

export class EmailAddress implements IEmailAddress {
    id?: number;
    contactId: number = 0;
    type: string = null;
    email: string ='';
    modified: Date = new  Date();
    timestamp: Date = new  Date();

    constructor(email: string){
        this.email = email;
    }
}