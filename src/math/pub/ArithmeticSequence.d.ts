import type ISequence from "./ISequence.d.ts";
/**
 * Represents an arithmetic sequence of numbers.
 */
export default class ArithmeticSequence implements ISequence<number> {
    start: number;
    end?: number;
    increment: number;
    currentValue: number;
    constructor(start?: number, end?: number, increment?: number);
    /**
     * Returns the current value of the sequence without advancing to the next value.
     */
    current(): number;
    /**
     * Advances the sequence to the next value and returns the updated value.
     */
    next(): number;
}
