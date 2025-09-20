import DeepMappableObject from "../../data_structures/pub/DeepMappableObject.js";
import VariableType from "../../types/VariableType.js";
import EncodeableFunction from "../../types/EncodeableFunction.js";
/**
 * A web worker running on a browser. Implements the IMessenger interface
 * and provides support for sending functions between workers.
 */
export default class WebWorker {
    constructor(worker) {
        this.worker = worker;
        this.encodedFunctionPrefix = "<<<<<";
    }
    /**
     * Maps every value of given type in given object.
     */
    _mapTypeInObj(obj, type, transformer) {
        return ((new DeepMappableObject(obj)).map((value) => (typeof value === type ?
            transformer(value) :
            value)).wrappee);
    }
    /**
     * Encodes the given function into a string.
     */
    encodeFunction(f) {
        return this.encodedFunctionPrefix + (new EncodeableFunction(f)).encode();
    }
    /**
     * Decodes a function that was stringified with .encodeFunction()
     * back into being a function.
     */
    decodeFunction(f) {
        return (new EncodeableFunction(f.slice(this.encodedFunctionPrefix.length))).decode();
    }
    postMessage(msg) {
        // Transform functions into a form where they can be
        // sent via the worker.
        if (typeof msg === "function") {
            msg = this.encodeFunction(msg);
        }
        else if (msg instanceof Object) {
            msg = this._mapTypeInObj(msg, "function", this.encodeFunction.bind(this));
        }
        this.worker.postMessage(msg);
        return this;
    }
    onMessage(handler) {
        this.worker.onmessage = (msg) => {
            // If msg.data is an object.
            if ((new VariableType(msg.data)).isRealObject()) {
                // Map all encoded functions back into real functions.
                var data = ((new DeepMappableObject(msg.data)).map((value) => {
                    // If the value to be mapped is an encoded function.
                    if (typeof value === "string" &&
                        value.length >= this.encodedFunctionPrefix.length &&
                        value.slice(0, this.encodedFunctionPrefix.length) === this.encodedFunctionPrefix) {
                        // Decode the string back into a real function.
                        return this.decodeFunction(value);
                    }
                    else {
                        // Value to be mapped is not an encoded function. Thus, we do nothing to it.
                        return value;
                    }
                }).wrappee);
            }
            else {
                // msg.data is not an object. Thus, we do nothing to it.
                var data = msg.data;
            }
            handler(data);
        };
        return this;
    }
    offMessage(handler) {
        this.worker.onmessage = null;
        return this;
    }
}
//# sourceMappingURL=WebWorker.js.map