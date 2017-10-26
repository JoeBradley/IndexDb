//self.addEventListener('message', (message) => {
//    //console.log('Message received from web worker parent', message);
//    postMessage('Messge received: ' + message.data, null);
//});

//self.postMessage('WorkerLoaded', null);

console.log('hello');
console.log(self);
self.onmessage = ((message) => {
console.log('Message received from web worker parent', message);
//    postMessage('Messge received: ' + message.data, null);
});

self.postMessage('WorkerLoaded');
