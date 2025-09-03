import type IMessenger from "../../../messaging/pub/IMessenger.d.ts";
import { WebSocketServer as RawWebSocketServer, ServerOptions } from 'ws';
import WebSocketMessenger from "./WebSocketMessenger.js";
import type { DMessage } from "../../../messaging/pub/DMessage.d.ts";
import { EventEmitter } from "events"

/**
 * A websocket server as an IMessenger.
 */
export default class WebSocketServer implements IMessenger<DMessage, DMessage> {
    private _server: RawWebSocketServer;
    private _webSockets: Map<string, WebSocketMessenger<DMessage, DMessage>> = new Map();
    private _emitter = new EventEmitter();

    constructor(serverOptions?: ServerOptions) {
        this._server = new RawWebSocketServer(serverOptions);
        this._server.on("connection", (ws) => {
            const client = new WebSocketMessenger<DMessage, DMessage>(ws);
            let name: string;
            client.onMessage((m) => {
                if (m.type === "event" && m.message.type === "hello") {
                    this._webSockets.set(m.sender, client);
                    name = m.sender;

                } else if (this._webSockets.has(m.sender)) {
                    this._emitter.emit("message", m);
                }
            });

            ws.on('error', console.error);
            ws.on("close", () => {
                if (name !== undefined) this._webSockets.delete(name);
            });
        });
    }

    postMessage(msg: DMessage): void {
        if (msg.recipient === "*") {
            this._webSockets.forEach((ws) => ws.postMessage(msg));
        } else if (this._webSockets.has(msg.recipient)) {
            this._webSockets.get(msg.recipient).postMessage(msg);
        }
    }

    onMessage(handler: (msg: DMessage) => void): void {
        this._emitter.on("message", handler);
    }
    
    offMessage(handler: (msg: DMessage) => void): void {
        this._emitter.off("message", handler);
    }
}