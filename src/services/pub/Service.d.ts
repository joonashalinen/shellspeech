import { ProxyMessenger, DMessage } from "../../messaging/index.js";
import IService from "./IService.js";
/**
 * Base implementation of IService.
 */
export default class Service implements IService {
    id: string;
    proxyMessenger?: ProxyMessenger<DMessage, DMessage>;
    outEvents?: {
        [listenerMethod: string]: string;
    };
    eventHandlers?: {
        [event: string]: (...args: unknown[]) => unknown;
    };
    log: (msg: string) => unknown;
    protected _initialized: boolean;
    constructor(id: string);
    initialize(...args: unknown[]): Promise<void>;
}
