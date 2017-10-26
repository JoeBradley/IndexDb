define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PhoneNumber {
        constructor(phone) {
            this.type = null;
            this.phone = '';
            this.modified = new Date();
            this.timestamp = new Date();
            this.phone = phone;
        }
    }
    exports.PhoneNumber = PhoneNumber;
});
//# sourceMappingURL=cc.idb.models.iphonenumber.js.map