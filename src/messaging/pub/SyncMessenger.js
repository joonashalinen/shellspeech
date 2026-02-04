var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from "../../events/index.js";
import ArithmeticSequence from "../../math/pub/ArithmeticSequence.js";
import StringSequence from "../../strings/pub/StringSequence.js";
/**
 * Provides the ability to perform synchronous messaging
 * with an IMessenger. Warning: it is assumed that there is
 * only one SyncMessenger per client service. Otherwise it is
 * possible that there are id conflicts, which can cause messages
 * to be redirected to the wrong caller.
 */
export default class SyncMessenger {
    constructor(messenger) {
        this.idGenerator = new StringSequence(new ArithmeticSequence());
        this.emitter = new EventEmitter();
        this.listeners = new Map();
        this.messenger = messenger;
        this.messenger.onMessage((m) => {
            this.emitter.trigger(m.id, [m]);
        });
    }
    /**
     * Posts a synchronous message that will yield
     * a response as a result.
     */
    postSyncMessage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.id === undefined) {
                req.id = req.sender + ":" + this.idGenerator.next();
            }
            const waitForResponse = new Promise((resolve, reject) => {
                const handler = (res) => {
                    if (res.type === "response" && res.recipient === req.sender && res.id === req.id) {
                        if (res.error === undefined) {
                            this.messenger.offMessage(handler);
                            resolve(res.message.args[0]);
                        }
                        else {
                            reject(new Error(res.error));
                        }
                    }
                };
                this.messenger.onMessage(handler);
            });
            this.messenger.postMessage(req);
            return yield waitForResponse;
        });
    }
    listen(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.type !== "listen")
                throw new Error("SyncMessenger.listen expects the message to have type 'listen'");
            if (this.listeners.has(callback))
                return;
            if (req.id === undefined) {
                req.id = req.sender + ":" + this.idGenerator.next();
            }
            const listener = (m) => {
                if (m.type === "event" && m.recipient === req.sender && m.id === req.id) {
                    callback(...m.message.args);
                }
            };
            this.listeners.set(callback, [req.id, listener]);
            this.emitter.on(req.id, listener);
            return yield this.postSyncMessage(req);
        });
    }
    unlisten(req, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.type !== "unlisten")
                throw new Error("SyncMessenger.unlisten expects the message to have type 'unlisten'");
            if (!this.listeners.has(callback))
                return;
            const [reqId, listener] = this.listeners.get(callback);
            this.listeners.delete(callback);
            this.emitter.off(reqId, listener);
            req.id = reqId;
            return yield this.postSyncMessage(req);
        });
    }
}
//# sourceMappingURL=SyncMessenger.js.map