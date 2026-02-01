import ServiceClient from "./ServiceClient.js";
import type { IServerProtocol } from "./ServiceWrapper.d.ts";
export type IArgumentType = boolean | number | string;
export type IArgumentTypeName = "boolean" | "number" | "string" | "json";
export interface IServiceConsoleBindings {
    [command: string]: IArgumentTypeName[];
}
export interface IServiceConsoleConfig {
    serviceId: string;
    clientId: string;
    serviceAddress?: string;
    protocol: IServerProtocol;
}
/**
 * A CLI client for a service that can be accessed via a ServiceClient.
 */
export declare class ServiceConsole {
    bindings: IServiceConsoleBindings;
    client: ServiceClient;
    constructor(bindings: IServiceConsoleBindings);
    initialize(configPath: string): Promise<void>;
    executeLine(line: string): Promise<void>;
    private _checkArguments;
    private _parseArguments;
    private _printResult;
    private _isShallowObject;
}
