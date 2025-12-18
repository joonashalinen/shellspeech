var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Base class for all clients of services that can be accessed via an IMessenger.
 */
export default class ServiceClient {
    constructor(messenger, clientServiceId, targetServiceId) {
        this.messenger = messenger;
        this.clientServiceId = clientServiceId;
        this.targetServiceId = targetServiceId;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.messenger.messenger.postMessage({
                sender: this.clientServiceId,
                recipient: this.targetServiceId,
                type: "event",
                message: {
                    type: "hello",
                    args: []
                }
            });
        });
    }
    call(method, args) {
        return this._call(method, args);
    }
    _call(method, args) {
        return this.messenger.postSyncMessage({
            sender: this.clientServiceId,
            recipient: this.targetServiceId,
            type: "request",
            message: {
                type: method,
                args: args
            }
        });
    }
    _listen(method, args, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                sender: this.clientServiceId,
                recipient: this.targetServiceId,
                type: "listen",
                message: {
                    type: method,
                    args: args
                }
            };
            yield this.messenger.listen(req, callback);
        });
    }
    _unlisten(method, args, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = {
                sender: this.clientServiceId,
                recipient: this.targetServiceId,
                type: "unlisten",
                message: {
                    type: method,
                    args: args
                }
            };
            yield this.messenger.unlisten(req, callback);
        });
    }
}
//# sourceMappingURL=ServiceClient.js.map