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
        if (proxyMessenger !== undefined) {
            proxyMessenger.onPostMessage((msg) => this.emitter.trigger("message", [msg]));
        }
    }
    /**
     * Call a method on the wrapped class. If the class
     * returns a result value, it will be emitted as a response message.
     * The given msg is assumed to be of type "request".
     */
    _callMethod(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = msg.type === "listen" ? this._listenCallArgs(msg) : msg.message.args;
            let result;
            let error;
            if (this.errorPolicy === "crash") {
                result = yield this.wrappee[msg.message.type](...args, msg);
            }
            else {
                try {
                    result = yield this.wrappee[msg.message.type](...args, msg);
                }
                catch (e) {
                    result = undefined;
                    error = e;
                }
            }
            const returnResult = (result !== undefined && result !== this.wrappee);
            const responseMsg = Object.assign({ sender: this.id, recipient: msg.sender, id: msg.id, type: "response", message: {
                    type: msg.message.type,
                    args: returnResult ? [result] : []
                } }, (error !== undefined ? { error: error.toString() } : {}));
            this.emitter.trigger("message", [responseMsg]);
        });
    }
    postMessage(msg) {
        if ((msg.type === "request" || msg.type === "listen") &&
            typeof this.wrappee === "object" &&
            msg.message.type in this.wrappee) {
            this._callMethod(msg);
        }
        else if (msg.type === "response") {
            if (this.proxyMessenger !== undefined) {
                this.proxyMessenger.message(msg);
            }
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
    _listenCallArgs(msg) {
        const args = Array.from(msg.message.args);
        const functionIndex = args.findIndex((a) => a === "<f>");
        const eventName = (typeof this.wrappee === "object" && "outEvents" in this.wrappee &&
            typeof this.wrappee.outEvents[msg.message.type] === "string") ?
            this.wrappee.outEvents[msg.message.type] : msg.message.type;
        const callback = (...eventArgs) => {
            this.emitter.trigger("message", [{
                    sender: this.id,
                    recipient: msg.sender,
                    id: "-",
                    type: "event",
                    message: {
                        type: eventName,
                        args: eventArgs
                    }
                }]);
        };
        args[functionIndex !== -1 ? functionIndex : args.length] = callback;
        return args;
    }
}
//# sourceMappingURL=MessengerClass.js.map