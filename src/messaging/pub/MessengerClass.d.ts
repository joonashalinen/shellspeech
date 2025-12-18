import type IMessenger from "./IMessenger.d.ts";
import type { DMessage } from "./DMessage.d.ts";
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
    wrappee: C;
    proxyMessenger?: ProxyMessenger<DMessage, DMessage>;
    id: string;
    emitter: EventEmitter;
    listeners: Map<string, Function>;
    errorPolicy: "crash" | "notify";
    constructor(wrappee: C, proxyMessenger?: ProxyMessenger<DMessage, DMessage>, id?: string);
    /**
     * Call a method on the wrapped class. If the class
     * returns a result value, it will be emitted as a response message.
     * The given msg is assumed to be of type "request".
     */
    _callMethod(msg: DMessage): Promise<void>;
    postMessage(msg: DMessage): Messenger;
    onMessage(handler: (msg: DMessage) => void): Messenger;
    offMessage(handler: (msg: DMessage) => void): Messenger;
    private _listenCallArgs;
    private _unlistenCallArgs;
}
export {};
