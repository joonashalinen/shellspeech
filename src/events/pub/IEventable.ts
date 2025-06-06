import EventEmitter from "./EventEmitter.js";

export function isEventable(obj: Object): obj is IEventable {
    return "emitter" in obj && obj.emitter instanceof EventEmitter;
}

export default interface IEventable {
    emitter: EventEmitter;
}