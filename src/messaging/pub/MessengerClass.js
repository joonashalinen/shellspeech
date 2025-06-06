var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import EventEmitter from "../../events/pub/EventEmitter.js";
/**
 * A wrapper for a given class that implements IMessenger
 * by simply calling the class's methods and using a ProxyMessenger.
 * The ProxyMessenger is assumed to be such that the wrappee class
 * has access to it and can thus use it to send and receive messages to and from MessengerClass.
 */
export default class MessengerClass {
    constructor(wrappee, proxyMessenger, id = "") {
        this.wrappee = wrappee;
        this.proxyMessenger = proxyMessenger;
        this.id = id;
        this.emitter = new EventEmitter();
        this.errorPolicy = "crash";
        proxyMessenger.onPostMessage((msg) => this.emitter.trigger("message", [msg]));
    }
    /**
     * Call a method on the wrapped class. If the class
     * returns a result value, it will be emitted as a response message.
     * The given msg is assumed to be of type "request".
     */
    _callMethod(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            var result;
            if (this.errorPolicy === "crash") {
                result = yield this.wrappee[msg.message.type](...msg.message.args, msg);
            }
            else {
                try {
                    result = yield this.wrappee[msg.message.type](...msg.message.args, msg);
                }
                catch (e) {
                    result = { error: e.toString() };
                }
            }
            // If the result is not the wrapped class itself or undefined then we assume 
            // that the result value matters and we send it as a response message.
            if (result !== undefined &&
                !(typeof result === "object" && result.constructor === this.wrappee.constructor)) {
                const responseMsg = {
                    sender: this.id,
                    recipient: msg.sender,
                    id: msg.id,
                    type: "response",
                    message: {
                        type: msg.message.type,
                        args: [result]
                    }
                };
                this.emitter.trigger("message", [responseMsg]);
            }
        });
    }
    postMessage(msg) {
        if (msg.type === "request" &&
            typeof this.wrappee === "object" &&
            msg.message.type in this.wrappee) {
            this._callMethod(msg);
        }
        else if (msg.type === "response") {
            this.proxyMessenger.message(msg);
        }
        else if (msg.type === "event") {
            if (typeof this.wrappee === "object" &&
                "eventHandlers" in this.wrappee &&
                typeof this.wrappee.eventHandlers === "object") {
                // If the event type has a direct handler in the service class, 
                // we use it by default.
                if (msg.message.type in this.wrappee.eventHandlers) {
                    this.wrappee.eventHandlers[msg.message.type](...msg.message.args, msg);
                }
                else if (typeof this.wrappee.eventHandlers["*"] === "function") {
                    // Else, if the service class has a fallback event handler for 
                    // all events, we use that.
                    this.wrappee.eventHandlers["*"](msg);
                }
            }
        }
        return this;
    }
    onMessage(handler) {
        this.emitter.on("message", handler);
        return this;
    }
    offMessage(handler) {
        this.emitter.off("message", handler);
        return this;
    }
}
//# sourceMappingURL=MessengerClass.js.map