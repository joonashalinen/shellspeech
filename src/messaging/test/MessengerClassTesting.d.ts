import { jest } from '@jest/globals';
import MessengerClass from "../pub/MessengerClass.js";
import ProxyMessenger from "../pub/ProxyMessenger.js";
import type { DMessage } from "../pub/DMessage.d.ts";
type TestObj = {
    test: jest.Mock;
};
export declare function createMessenger(): [
    MessengerClass<TestObj>,
    ProxyMessenger<DMessage, DMessage>,
    TestObj
];
export declare var testMessages: {
    type1: DMessage;
};
export {};
