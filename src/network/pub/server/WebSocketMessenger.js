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