import EventEmitter from "../../events/pub/EventEmitter.js";
export default class ProxyMessenger {
    constructor() {
        this.emitter = new EventEmitter();
    }
    postMessage(msg) {
        this.emitter.trigger("postMessage", [msg]);
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
     * Listen to calls to postMessage.
     */
    onPostMessage(handler) {
        this.emitter.on("postMessage", handler);
        return this;
    }
    /**
     * Manually cause ProxyMessenger to send a message.
     */
    message(msg) {
        this.emitter.trigger("message", [msg]);
        return this;
    }
}
//# sourceMappingURL=ProxyMessenger.js.map