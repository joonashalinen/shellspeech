import EventEmitter from "../../../events/pub/EventEmitter.js";
import type IMessenger from "../../../messaging/pub/IMessenger.d.ts";

export default class WebSocketMessenger<A, B> implements IMessenger<A, B> {
    emitter: EventEmitter;

    constructor(public socket: WebSocket) {
        this.emitter = new EventEmitter();

        this.socket.addEventListener('message', (event) => {
            const parsedMessage: B = JSON.parse(event.data);
            this.emitter.trigger("message", [parsedMessage]);
        });
    }

    postMessage(msg: A): IMessenger<A, B> {
        const serializedMsg = typeof msg !== "string" ? JSON.stringify(msg) : msg;
        this.socket.send(serializedMsg);
        return this;
    }

    onMessage(handler: (msg: B) => void): IMessenger<A, B> {
        this.emitter.on("message", handler);
        return this;
    }

    offMessage(handler: (msg: B) => void): IMessenger<A, B> {
        this.emitter.off("message", handler);
        return this;
    }

    /**
     * This method can be awaited to ensure
     * the websocket connection is open 
     * before sending any messages.
     */
    async waitForOpen() {
        if (this.socket.readyState === WebSocket.CONNECTING) {
            // Wait for connection to open.
            await new Promise((resolve, reject) => {
                this.socket.addEventListener("open", (event) => {
                    resolve(event);
                });
            });
        }
    }
}
