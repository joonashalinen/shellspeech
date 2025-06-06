import EventEmitter from "../../events/pub/EventEmitter.js";
import type IMessenger from "./IMessenger.d.ts";
export default class ProxyMessenger<I, R> implements IMessenger<I, R> {
    emitter: EventEmitter;
    postMessage(msg: I): ProxyMessenger<I, R>;
    onMessage(handler: (msg: R) => void): ProxyMessenger<I, R>;
    offMessage(handler: (msg: R) => void): ProxyMessenger<I, R>;
    /**
     * Listen to calls to postMessage.
     */
    onPostMessage(handler: (msg: I) => void): this;
    /**
     * Manually cause ProxyMessenger to send a message.
     */
    message(msg: R): this;
}
