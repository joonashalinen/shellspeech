var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import EventEmitter from "../../../events/pub/EventEmitter.js";
export default class WebSocketMessenger {
    constructor(socket) {
        this.socket = socket;
        this.emitter = new EventEmitter();
        this.socket.addEventListener('message', (event) => {
            const parsedMessage = JSON.parse(event.data);
            this.emitter.trigger("message", [parsedMessage]);
        });
    }
    postMessage(msg) {
        const serializedMsg = typeof msg !== "string" ? JSON.stringify(msg) : msg;
        this.socket.send(serializedMsg);
        return this;
    }
    onMessage(handler) {
        this.emitter.on("message", handler);
        return this;
    }
    offMessage(handler) {
        this.emitter.off("message", handler);
        return this;
    }
    /**
     * This method can be awaited to ensure
     * the websocket connection is open
     * before sending any messages.
     */
    waitForOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket.readyState === WebSocket.CONNECTING) {
                // Wait for connection to open.
                yield new Promise((resolve, reject) => {
                    this.socket.addEventListener("open", (event) => {
                        resolve(event);
                    });
                });
            }
        });
    }
}
//# sourceMappingURL=WebSocketMessenger.js.map