import ServiceClient from "./ServiceClient.js";
export type IArgumentType = boolean | number | string;
export type IArgumentTypeName = "boolean" | "number" | "string";
export interface IServiceConsoleBindings {
    [command: string]: IArgumentTypeName[];
}
/**
 * A CLI client for a service that can be accessed via a ServiceClient.
 */
export declare class ServiceConsole {
    client: ServiceClient;
    bindings: IServiceConsoleBindings;
    constructor(client: ServiceClient, bindings: IServiceConsoleBindings);
    initialize(): void;
    executeLine(line: string): Promise<void>;
    private _checkArguments;
    private _parseArguments;
    private _printResult;
}
