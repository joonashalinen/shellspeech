import EventEmitter from "./EventEmitter.js";
export function isEventable(obj) {
    return "emitter" in obj && obj.emitter instanceof EventEmitter;
}
//# sourceMappingURL=IEventable.js.map