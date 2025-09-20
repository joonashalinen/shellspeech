import type IMappable from "./IMappable.d.ts";
/**
 * Provides deep mapping for plain javascript arrays.
 */
export default class DeepMappableArray implements IMappable {
    wrappee: Array<unknown>;
    constructor(wrappee: Array<unknown>);
    map(transformer: (value: unknown) => unknown): IMappable;
}
