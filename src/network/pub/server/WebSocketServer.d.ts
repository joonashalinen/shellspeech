import { IMessenger } from "../../../messaging";
import { DMessage } from "../../../messaging/pub/DMessage";
/**
 * A websocket server as an IMessenger.
 */
export default class WebSocketServer implements IMessenger<DMessage, DMessage> {
    private _server;
    private _webSockets;
    private _emitter;
    constructor();
    postMessage(msg: DMessage): void;
    onMessage(handler: (msg: DMessage) => void): void;
    offMessage(handler: (msg: DMessage) => void): void;
}
