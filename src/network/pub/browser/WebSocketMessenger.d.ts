import EventEmitter from "../../../events/pub/EventEmitter.js";
import type IMessenger from "../../../messaging/pub/IMessenger.d.ts";
export default class WebSocketMessenger<A, B> implements IMessenger<A, B> {
    socket: WebSocket;
    emitter: EventEmitter;
    constructor(socket: WebSocket);
    postMessage(msg: A): IMessenger<A, B>;
    onMessage(handler: (msg: B) => void): IMessenger<A, B>;
    offMessage(handler: (msg: B) => void): IMessenger<A, B>;
    /**
     * This method can be awaited to ensure
     * the websocket connection is open
     * before sending any messages.
     */
    waitForOpen(): Promise<void>;
}
