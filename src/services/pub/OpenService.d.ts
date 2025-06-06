import FunctionWrapper from "./FunctionWrapper.js";
import type IService from "./IService.d.ts";
interface DataObject {
    [key: string]: unknown;
}
/**
 * A service that is completely open to custom
 * modification by outsiders.
 */
export default class OpenService {
    service: IService;
    constructor(service: IService);
    /**
     * Modify the class with a given function
     * that is allowed to do anything to the class.
     */
    modify(modifier: FunctionWrapper<(...args: unknown[]) => void>): any;
    /**
     * Listen to an event via a given function.
     * The given function 'listener' is given a function 'sendMsg', which
     * 'listener' can call when it wants to send back an event message
     * to the listening service.
     */
    listen(listeningService: string, listener: FunctionWrapper<(sendMsg: (eventName: string, event: DataObject) => void, ...args: unknown[]) => void>): void;
}
export {};
