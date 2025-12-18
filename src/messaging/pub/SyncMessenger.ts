import { EventEmitter } from "../../events/index.js";
import ArithmeticSequence from "../../math/pub/ArithmeticSequence.js";
import StringSequence from "../../strings/pub/StringSequence.js";
import type { DMessage } from "./DMessage.d.ts";
import type IMessenger from "./IMessenger.d.ts";

/**
 * Provides the ability to perform synchronous messaging 
 * with an IMessenger. Warning: it is assumed that there is
 * only one SyncMessenger per client service. Otherwise it is
 * possible that there are id conflicts, which can cause messages
 * to be redirected to the wrong caller.
 */
export default class SyncMessenger {
    messenger: IMessenger<DMessage, DMessage>;
    idGenerator = new StringSequence(new ArithmeticSequence());
    emitter: EventEmitter = new EventEmitter();
    listeners: Map<Function, [string, Function]> = new Map();

    constructor(messenger: IMessenger<DMessage, DMessage>) {
        this.messenger = messenger;
        this.messenger.onMessage((m) => {
            this.emitter.trigger(m.id, [m]);
        });
    }

    /**
     * Posts a synchronous message that will yield 
     * a response as a result.
     */
    async postSyncMessage(req: DMessage): Promise<unknown> {
        if (req.id === undefined) {
            req.id = req.sender + ":" + this.idGenerator.next();
        }
        
        const waitForResponse = new Promise<unknown>((resolve, reject) => {
            this.messenger.onMessage((res: DMessage) => {
                if (res.type === "response" && res.recipient === req.sender && res.id === req.id) {
                    if (res.error === undefined) {
                        resolve(res.message.args[0]);
                    } else {
                        reject(new Error(res.error));
                    }
                }
            });
        });

        this.messenger.postMessage(req);
        return await waitForResponse;
    }

    async listen(req: DMessage, callback: (...args: unknown[]) => unknown): Promise<unknown> {
        if (req.type !== "listen")
            throw new Error("SyncMessenger.listen expects the message to have type 'listen'");
        if (this.listeners.has(callback)) return;

        if (req.id === undefined) {
            req.id = req.sender + ":" + this.idGenerator.next();
        }

        const listener = (m: DMessage) => {
            if (m.type === "event" && m.recipient === req.sender && m.id === req.id) {
                callback(...m.message.args);
            }
        };

        this.listeners.set(callback, [req.id, listener]);
        this.emitter.on(req.id, listener);
        return await this.postSyncMessage(req);
    }

    async unlisten(req: DMessage, callback: (...args: unknown[]) => unknown): Promise<unknown> {
        if (req.type !== "unlisten")
            throw new Error("SyncMessenger.unlisten expects the message to have type 'unlisten'");
        if (!this.listeners.has(callback)) return;

        const [reqId, listener] = this.listeners.get(callback);
        this.listeners.delete(callback);
        this.emitter.off(reqId, listener);
        req.id = reqId;

        return await this.postSyncMessage(req);
    }
}