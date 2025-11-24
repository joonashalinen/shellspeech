import { ProxyMessenger, DMessage } from "../../messaging/index.js";
import IService from "./IService.js";

/**
 * Base implementation of IService.
 */
export default class Service implements IService {
    public proxyMessenger?: ProxyMessenger<DMessage, DMessage>;
    public outEvents?: { [listenerMethod: string]: string; };
    public eventHandlers?: { [event: string]: (...args: unknown[]) => unknown; };
    public log: (msg: string) => unknown = console.log.bind(console);
    protected _initialized: boolean = false;

    constructor(public id: string) {}
    
    async initialize(...args: unknown[]): Promise<void> {
        if (this._initialized) return;
        this._initialized = true;
    }
}