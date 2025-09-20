/**
 * Provides the ability to transform a given function
 * into a string and vice versa.
 */
export default class EncodeableFunction {
    wrappee: Function | string;
    constructor(f: Function | string);
    /**
     * The function as a string.
     */
    encode(): string;
    /**
     * The function as a Function.
     */
    decode(): Function;
}
