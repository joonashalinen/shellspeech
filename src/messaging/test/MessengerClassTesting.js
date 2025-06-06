import { jest } from '@jest/globals';
import MessengerClass from "../pub/MessengerClass.js";
import ProxyMessenger from "../pub/ProxyMessenger.js";
export function createMessenger() {
    var obj = { test: jest.fn() };
    var proxy = new ProxyMessenger();
    var messenger = new MessengerClass(obj, proxy);
    return [messenger, proxy, obj];
}
export var testMessages = {
    "type1": {
        sender: "sender1",
        recipient: "recipient1",
        type: "request",
        message: {
            type: "test",
            args: ["test"]
        }
    }
};
//# sourceMappingURL=MessengerClassTesting.js.map