define(["require", "exports", "./cc.idb.dbcontext"], function (require, exports, model) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Service {
        constructor() {
            this.self = self;
            this.self.onmessage = ((message) => {
                console.log('Message received from web worker parent', message);
            });
            console.log('Service: Loaded');
            var e = new model.Email('chris@test.com');
            this.self.postMessage({ action: 'email/post', email: e });
        }
    }
    exports.Service = Service;
});
//# sourceMappingURL=service.js.map