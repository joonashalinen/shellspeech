import type { DMessage } from "./DMessage.d.ts";
/**
 * Factory for creating objects implementing the
 * DMessage interface.
 */
export default class MessageFactory {
    sender: string;
    constructor(sender: string);
    /**
     * Create a new request DMessage.
     */
    createRequest(recipient: string, type: string, args?: Array<unknown>): DMessage;
    /**
     * Create a new event DMessage.
     */
    createEvent(recipient: string, type: string, args?: Array<unknown>): DMessage;
    /**
     * Create a new response DMessage.
     */
    createResponse(recipient: string, type: string, args?: Array<unknown>): DMessage;
}
