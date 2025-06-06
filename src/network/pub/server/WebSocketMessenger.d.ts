import { WebSocket } from 'ws';
import type IMessenger from '../../../messaging/pub/IMessenger.d.ts';
export default class WebSocketMessenger<A, B> implements IMessenger<A, B> {
    private ws;
    private messageHandlers;
    constructor(socket: WebSocket);
    private setupWebSocket;
    postMessage(msg: A): IMessenger<A, B>;
    onMessage(handler: (msg: B) => void): IMessenger<A, B>;
    offMessage(handler: (msg: B) => void): IMessenger<A, B>;
}
