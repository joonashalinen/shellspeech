import EventEmitter from "../../events/pub/EventEmitter.js";
import type IMessenger from "./IMessenger.d.ts";
export default class LoopbackMessenger<A> implements IMessenger<A, A> {
    emitter: EventEmitter;
    postMessage(msg: A): LoopbackMessenger<A>;
    onMessage(handler: (msg: A) => void): LoopbackMessenger<A>;
    offMessage(handler: (msg: A) => void): LoopbackMessenger<A>;
}
