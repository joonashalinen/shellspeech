var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class WebSocketMessenger {
    constructor(socket) {
        this.messageHandlers = [];
        this.ws = socket;
        this.setupWebSocket();
    }
    setupWebSocket() {
        this.ws.on('message', (data) => {
            try {
                const parsedData = JSON.parse(data.toString());
                this.messageHandlers.forEach(handler => handler(parsedData));
            }
            catch (error) {
                throw new Error('Error parsing incoming message:' + error);
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                this.ws.on("open", () => { resolve(); });
                this.ws.on("error", (e) => { reject(e); });
            });
        });
    }
    postMessage(msg) {
        try {
            const serializedMsg = JSON.stringify(msg);
            this.ws.send(serializedMsg);
        }
        catch (error) {
            throw new Error('Error sending message: ' + error);
        }
        return this;
    }
    onMessage(handler) {
        this.messageHandlers.push(handler);
        return this;
    }
    offMessage(handler) {
        const handlerIndex = this.messageHandlers.indexOf(handler);
        if (handlerIndex !== -1) {
            this.messageHandlers.splice(handlerIndex, 1);
        }
        return this;
    }
}
//# sourceMappingURL=WebSocketMessenger.js.map