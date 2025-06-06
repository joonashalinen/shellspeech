var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import MessageFactory from "../../messaging/pub/MessageFactory.js";
import SyncMessenger from "../../messaging/pub/SyncMessenger.js";
/**
 * Provides a more clean and convenient interface for
 * dealing with messaging to/from a specific destination.
 */
export default class Channel {
    constructor(clientId, targetId, messenger) {
        this.clientId = clientId;
        this.targetId = targetId;
        this.messenger = messenger;
        this.syncMessenger = new SyncMessenger(this.messenger);
        this.messageFactory = new MessageFactory(clientId);
    }
    /**
     * Sends a request message to the target.
     * Returns a promise that is fulfilled with the response of the target.
     */
    request(method_1) {
        return __awaiter(this, arguments, void 0, function* (method, args = []) {
            return yield (this.syncMessenger.postSyncMessage(this.messageFactory.createRequest(this.targetId, method, args)));
        });
    }
    /**
     * Sends an event message to the target.
     */
    sendEvent(eventName, args = []) {
        this.messenger.postMessage(this.messageFactory.createEvent(this.targetId, eventName, args));
    }
}
//# sourceMappingURL=Channel.js.map