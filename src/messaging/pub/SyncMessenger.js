var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ArithmeticSequence from "../../math/pub/ArithmeticSequence.js";
import StringSequence from "../../strings/pub/StringSequence.js";
/**
 * Provides the ability to perform synchronous messaging
 * with an IMessenger.
 */
export default class SyncMessenger {
    constructor(messenger) {
        this.idGenerator = new StringSequence(new ArithmeticSequence());
        this.messenger = messenger;
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
            const waitForResponse = new Promise((resolve) => {
                this.messenger.onMessage((res) => {
                    if (res.type === "response" && res.recipient === req.sender && res.id === req.id) {
                        resolve(res.message.args[0]);
                    }
                });
            });
            this.messenger.postMessage(req);
            return yield waitForResponse;
        });
    }
}
//# sourceMappingURL=SyncMessenger.js.map