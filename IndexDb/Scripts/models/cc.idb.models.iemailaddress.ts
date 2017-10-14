/* Just for code completion and compilation - defines
    * the interface of objects stored in the emails table.
    */
export interface IEmailAddress {
    id?: number;
    contactId: number;
    type: string;
    email: string;
    modified: Date;
    timestamp: Date;
}