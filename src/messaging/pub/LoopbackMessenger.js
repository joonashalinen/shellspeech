import EventEmitter from "../../events/pub/EventEmitter.js";
export default class LoopbackMessenger {
    constructor() {
        this.emitter = new EventEmitter();
    }
    postMessage(msg) {
        setTimeout(() => {
            this.emitter.trigger("message", [msg]);
        }, 0);
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
}
//# sourceMappingURL=LoopbackMessenger.js.map