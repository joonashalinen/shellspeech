import type DataObject from "./DataObject.d.ts";
import DeepMappableObject from "./DeepMappableObject.js";
import type IMappable from "./IMappable.d.ts";
import VariableType from "../../types/VariableType.js";

/**
 * Provides deep mapping for plain javascript arrays.
 */
export default class DeepMappableArray implements IMappable {
    wrappee: Array<unknown>;
    
    constructor(wrappee: Array<unknown>) {
        this.wrappee = wrappee;
    }

    map(transformer: (value: unknown) => unknown): IMappable {
        this.wrappee = this.wrappee.map((value: unknown) => {
            if (Array.isArray(value)) {
                return (new DeepMappableArray(value)).map(transformer).wrappee;
            } else if ((new VariableType(value)).isRealObject()) {
                return (new DeepMappableObject(value as DataObject)).map(transformer).wrappee;
            } else {
                return transformer(value);
            }
        });
        return this;
    }
    
}