import * as model from './cc.idb.dbcontext';

export class Service {
    private self: any;

    public constructor() {
        this.self = self;
        
        this.self.onmessage = ((message) => {
            console.log('Message received from web worker parent', message);
        });

        console.log('Service: Loaded');
        
        var e = new model.Email('chris@test.com');        
        this.self.postMessage({ action: 'email/post', email: e });
    }
}
