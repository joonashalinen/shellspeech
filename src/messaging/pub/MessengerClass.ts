import type IMessenger from "./IMessenger.d.ts";
import type {DMessage} from "./DMessage.d.ts";
import EventEmitter from "../../events/pub/EventEmitter.js";
import ProxyMessenger from "./ProxyMessenger.js";

type Messenger = IMessenger<DMessage, DMessage>;

/**
 * A wrapper for a given class that implements IMessenger
 * by simply calling the class's methods and using a ProxyMessenger. 
 * The ProxyMessenger is assumed to be such that the wrappee class 
 * has access to it and can thus use it to send and receive messages to and from MessengerClass.
 */
export default class MessengerClass<C extends object> implements IMessenger<DMessage, DMessage> {
    emitter: EventEmitter = new EventEmitter();
    listeners: Map<string, Function> = new Map();
    errorPolicy: "crash" | "notify" = "crash";

    constructor(
        public wrappee: C, 
        public proxyMessenger?: ProxyMessenger<DMessage, DMessage>, 
        public id: string = ""
    ) {
        if (proxyMessenger !== undefined) {
            proxyMessenger.onPostMessage((msg) => this.emitter.trigger("message", [msg]));
        }
    }

    /**
     * Call a method on the wrapped class. If the class 
     * returns a result value, it will be emitted as a response message. 
     * The given msg is assumed to be of type "request".
     */
    async _callMethod(msg: DMessage) {
        let args: unknown[] = msg.message.args;
        if (msg.type === "listen") args = this._listenCallArgs(msg);
        if (msg.type === "unlisten") args = this._unlistenCallArgs(msg);

        let result: unknown;
        let error: unknown;
        if (this.errorPolicy === "crash") {
            result = await this.wrappee[msg.message.type](...args, msg);
        } else {
            try {
                result = await this.wrappee[msg.message.type](...args, msg);
            } catch (e) {
                result = undefined;
                error = e;
            }
        }

        const returnResult = (result !== undefined && result !== this.wrappee);
        const responseMsg: DMessage = {
            sender: this.id,
            recipient: msg.sender,
            id: msg.id,
            type: "response",
            message: {
                type: msg.message.type,
                args: returnResult ? [result] : []
            },
            ...(error !== undefined ? {error: error.toString()} : {})
        };
        this.emitter.trigger("message", [responseMsg]);
    }

    postMessage(msg: DMessage): Messenger {
        if (
            (msg.type === "request" || msg.type === "listen") && 
            typeof this.wrappee === "object" && 
            msg.message.type in this.wrappee
        ) {
            this._callMethod(msg);

        } else if (msg.type === "response") {
            if (this.proxyMessenger !== undefined) {
                this.proxyMessenger.message(msg);
            }

        } else if (msg.type === "event") {
            if (
                typeof this.wrappee === "object" && 
                "eventHandlers" in this.wrappee && 
                typeof this.wrappee.eventHandlers === "object"
            ) {
                // If the event type has a direct handler in the service class, 
                // we use it by default.
                if (msg.message.type in this.wrappee.eventHandlers) {
                    this.wrappee.eventHandlers[msg.message.type](...msg.message.args, msg)
                } else if (typeof this.wrappee.eventHandlers["*"] === "function"){
                    // Else, if the service class has a fallback event handler for 
                    // all events, we use that.
                    this.wrappee.eventHandlers["*"](msg)
                }
            }
        }
        return this;
    }

    onMessage(handler: (msg: DMessage) => void): Messenger {
        this.emitter.on("message", handler);
        return this;
    }

    offMessage(handler: (msg: DMessage) => void): Messenger {
        this.emitter.off("message", handler);
        return this;
    }

    private _listenCallArgs(msg: DMessage) {
        const args = Array.from(msg.message.args);
        const functionIndex = args.findIndex((a) => a === "<f>");

        const eventName = (
            typeof this.wrappee === "object" && "outEvents" in this.wrappee && 
            typeof this.wrappee.outEvents[msg.message.type] === "string"
            ) ?
            this.wrappee.outEvents[msg.message.type] : msg.message.type;

        const callback = (...eventArgs: unknown[]) => {
            this.emitter.trigger("message", [{
                sender: this.id,
                recipient: msg.sender,
                id: msg.id,
                type: "event",
                message: {
                    type: eventName,
                    args: eventArgs
                }
            }]);
        };

        this.listeners.set(`${msg.sender}-${msg.id}`, callback);
        args[functionIndex !== -1 ? functionIndex : args.length] = callback;
        return args;
    }

    private _unlistenCallArgs(msg: DMessage) {
        const args = Array.from(msg.message.args);
        const functionIndex = args.findIndex((a) => a === "<f>");

        const callback = this.listeners.get(`${msg.sender}-${msg.id}`);
        this.listeners.delete(`${msg.sender}-${msg.id}`);
        args[functionIndex !== -1 ? functionIndex : args.length] = callback;
        return args;
    }
}