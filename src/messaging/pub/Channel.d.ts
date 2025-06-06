import type { DMessage } from "../../messaging/pub/DMessage.d.ts";
import MessageFactory from "../../messaging/pub/MessageFactory.js";
import SyncMessenger from "../../messaging/pub/SyncMessenger.js";
import type IMessenger from "./IMessenger.d.ts";
/**
 * Provides a more clean and convenient interface for
 * dealing with messaging to/from a specific destination.
 */
export default class Channel {
    clientId: string;
    targetId: string;
    messenger: IMessenger<DMessage, DMessage>;
    syncMessenger: SyncMessenger;
    messageFactory: MessageFactory;
    constructor(clientId: string, targetId: string, messenger: IMessenger<DMessage, DMessage>);
    /**
     * Sends a request message to the target.
     * Returns a promise that is fulfilled with the response of the target.
     */
    request(method: string, args?: unknown[]): Promise<unknown>;
    /**
     * Sends an event message to the target.
     */
    sendEvent(eventName: string, args?: unknown[]): void;
}
