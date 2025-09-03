import type IMessenger from "../../../messaging/pub/IMessenger.d.ts";
import { ServerOptions } from 'ws';
import type { DMessage } from "../../../messaging/pub/DMessage.d.ts";
/**
 * A websocket server as an IMessenger.
 */
export default class WebSocketServer implements IMessenger<DMessage, DMessage> {
    private _server;
    private _webSockets;
    private _emitter;
    constructor(serverOptions?: ServerOptions);
    postMessage(msg: DMessage): void;
    onMessage(handler: (msg: DMessage) => void): void;
    offMessage(handler: (msg: DMessage) => void): void;
}
