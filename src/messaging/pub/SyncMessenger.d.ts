import { EventEmitter } from "../../events/index.js";
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
    idGenerator: StringSequence;
    emitter: EventEmitter;
    constructor(messenger: IMessenger<DMessage, DMessage>);
    /**
     * Posts a synchronous message that will yield
     * a response as a result.
     */
    postSyncMessage(req: DMessage): Promise<unknown>;
    listen(req: DMessage, callback: (m: unknown) => unknown): Promise<unknown>;
}
