import type ISequence from "../../math/pub/ISequence.d.ts";
/**
 * A sequence of string values.
 */
export default class StringSequence implements ISequence<string> {
    wrappee: ISequence<Object>;
    prefix: string;
    suffix: string;
    constructor(wrappee: ISequence<Object>);
    current(): string;
    next(): string;
}
