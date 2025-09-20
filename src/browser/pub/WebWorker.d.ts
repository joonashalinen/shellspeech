import type IMessenger from "../../messaging/pub/IMessenger.d.ts";
import type DataObject from "../../data_structures/pub/DataObject.d.ts";
export interface BrowserWebWorker {
    postMessage(msg: unknown): void;
    onmessage: ((ev: MessageEvent<unknown>) => unknown) | null;
}
/**
 * A web worker running on a browser. Implements the IMessenger interface
 * and provides support for sending functions between workers.
 */
export default class WebWorker<I, R> implements IMessenger<I, R> {
    worker: BrowserWebWorker;
    encodedFunctionPrefix: string;
    constructor(worker: BrowserWebWorker);
    /**
     * Maps every value of given type in given object.
     */
    _mapTypeInObj(obj: DataObject, type: string, transformer: Function): DataObject;
    /**
     * Encodes the given function into a string.
     */
    encodeFunction(f: Function): string;
    /**
     * Decodes a function that was stringified with .encodeFunction()
     * back into being a function.
     */
    decodeFunction(f: string): Function;
    postMessage(msg: unknown): WebWorker<I, R>;
    onMessage(handler: Function): WebWorker<I, R>;
    offMessage(handler: Function): WebWorker<I, R>;
}
