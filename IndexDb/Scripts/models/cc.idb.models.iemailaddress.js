define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EmailAddress {
        constructor(email) {
            this.contactId = 0;
            this.type = null;
            this.email = '';
            this.modified = new Date();
            this.timestamp = new Date();
            this.email = email;
        }
    }
    exports.EmailAddress = EmailAddress;
});
//# sourceMappingURL=cc.idb.models.iemailaddress.js.map