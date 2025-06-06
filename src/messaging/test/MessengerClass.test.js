var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect, test, jest } from '@jest/globals';
import { createMessenger, testMessages } from "./MessengerClassTesting.js";
test("postMessage", () => __awaiter(void 0, void 0, void 0, function* () {
    var [messenger, proxy, obj] = createMessenger();
    messenger.postMessage(testMessages.type1);
    yield new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, 1000);
    });
    expect(obj.test.mock.calls).toEqual([["test"]]);
}));
test("onMessage", () => __awaiter(void 0, void 0, void 0, function* () {
    var [messenger, proxy, obj] = createMessenger();
    var onMessage = jest.fn();
    messenger.onMessage(onMessage);
    proxy.postMessage(testMessages.type1);
    yield new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, 1000);
    });
    expect(onMessage.mock.calls).toEqual([[testMessages.type1]]);
}));
//# sourceMappingURL=MessengerClass.test.js.map