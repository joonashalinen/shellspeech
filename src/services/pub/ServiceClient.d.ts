import { SyncMessenger } from "../../messaging/index.js";
/**
 * Base class for all clients of services that can be accessed via an IMessenger.
 */
export default class ServiceClient {
    messenger: SyncMessenger;
    clientServiceId: string;
    targetServiceId: string;
    constructor(messenger: SyncMessenger, clientServiceId: string, targetServiceId: string);
    protected _call<T>(method: string, args: unknown[]): Promise<T>;
    protected _listen<T>(method: string, args: unknown[], callback: (r: T) => unknown): Promise<void>;
}
