import StringSequence from "../../strings/pub/StringSequence.js";
import type { DMessage } from "./DMessage.d.ts";
import type IMessenger from "./IMessenger.d.ts";
/**
 * Provides the ability to perform synchronous messaging
 * with an IMessenger.
 */
export default class SyncMessenger {
    messenger: IMessenger<DMessage, DMessage>;
    idGenerator: StringSequence;
    constructor(messenger: IMessenger<DMessage, DMessage>);
    /**
     * Posts a synchronous message that will yield
     * a response as a result.
     */
    postSyncMessage(req: DMessage): Promise<unknown>;
}
