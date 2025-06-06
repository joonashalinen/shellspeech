import EventEmitter from "./EventEmitter.js";
export declare function isEventable(obj: Object): obj is IEventable;
export default interface IEventable {
    emitter: EventEmitter;
}
