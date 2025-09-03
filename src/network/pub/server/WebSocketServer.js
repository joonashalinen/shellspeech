import { WebSocketServer as RawWebSocketServer } from 'ws';
import WebSocketMessenger from "./WebSocketMessenger.js";
import { EventEmitter } from "events";
/**
 * A websocket server as an IMessenger.
 */
export default class WebSocketServer {
    constructor(serverOptions) {
        this._webSockets = new Map();
        this._emitter = new EventEmitter();
        this._server = new RawWebSocketServer(serverOptions);
        this._server.on("connection", (ws) => {
            const client = new WebSocketMessenger(ws);
            let name;
            client.onMessage((m) => {
                if (m.type === "event" && m.message.type === "hello") {
                    this._webSockets.set(m.sender, client);
                    name = m.sender;
                }
                else if (this._webSockets.has(m.sender)) {
                    this._emitter.emit("message", m);
                }
            });
            ws.on('error', console.error);
            ws.on("close", () => {
                if (name !== undefined)
                    this._webSockets.delete(name);
            });
        });
    }
    postMessage(msg) {
        if (this._webSockets.has(msg.recipient)) {
            this._webSockets.get(msg.recipient).postMessage(msg);
        }
    }
    onMessage(handler) {
        this._emitter.on("message", handler);
    }
    offMessage(handler) {
        this._emitter.off("message", handler);
    }
}
//# sourceMappingURL=WebSocketServer.js.map