import type DataObject from "./DataObject.d.ts";
import type IMappable from "./IMappable.d.ts";
/**
 * Provides deep mapping for plain javascript objects.
 */
export default class DeepMappableObject implements IMappable {
    wrappee: DataObject;
    constructor(wrappee: DataObject);
    /**
     * Deep map through all the object's values. Deep maps through nested arrays as well.
     */
    map(transformer: (value: unknown) => unknown): DeepMappableObject;
}
