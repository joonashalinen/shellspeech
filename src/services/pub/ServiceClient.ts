import { DMessage, SyncMessenger } from "../../messaging/index.js";

/**
 * Base class for all clients of services that can be accessed via an IMessenger.
 */
export default class ServiceClient {
    constructor(public messenger: SyncMessenger,
        public clientServiceId: string, public targetServiceId: string) {}
    
    async initialize() {
        this.messenger.messenger.postMessage({
            sender: this.clientServiceId,
            recipient: this.targetServiceId,
            type: "event",
            message: {
                type: "hello",
                args: []
            }
        });
    }

    call<T>(method: string, args: unknown[]): Promise<T> {
        return this._call(method, args);
    }

    protected _call<T>(method: string, args: unknown[]): Promise<T> {
        return this.messenger.postSyncMessage({
            sender: this.clientServiceId,
            recipient: this.targetServiceId,
            type: "request",
            message: {
                type: method,
                args: args
            }
        }) as Promise<T>;
    }

    protected async _listen(method: string,
        args: unknown[], callback: (...args: unknown[]) => unknown): Promise<void> {
        
        const req: DMessage = {
            sender: this.clientServiceId,
            recipient: this.targetServiceId,
            type: "listen",
            message: {
                type: method,
                args: args
            }
        };

        await this.messenger.listen(req, callback);
    }
}