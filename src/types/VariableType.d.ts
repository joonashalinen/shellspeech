/**
 * Provides utilities for testing the type of a variable.
 */
export default class VariableType {
    variable: unknown;
    constructor(variable: unknown);
    isNothing(): boolean;
    isRealPrimitive(): boolean;
    isPrimitive(): boolean;
    isFunction(): boolean;
    isObject(): boolean;
    isDataStructure(): boolean;
    isRealObject(): boolean;
    isArray(): boolean;
    isInstanceOf(classType: any): boolean;
}
