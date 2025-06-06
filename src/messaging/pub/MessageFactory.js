/**
 * Factory for creating objects implementing the
 * DMessage interface.
 */
export default class MessageFactory {
    constructor(sender) {
        this.sender = sender;
    }
    /**
     * Create a new request DMessage.
     */
    createRequest(recipient, type, args = []) {
        return {
            recipient: recipient,
            sender: this.sender,
            type: "request",
            message: {
                type: type,
                args: args
            }
        };
    }
    /**
     * Create a new event DMessage.
     */
    createEvent(recipient, type, args = []) {
        return {
            recipient: recipient,
            sender: this.sender,
            type: "event",
            message: {
                type: type,
                args: args
            }
        };
    }
    /**
     * Create a new response DMessage.
     */
    createResponse(recipient, type, args = []) {
        return {
            recipient: recipient,
            sender: this.sender,
            type: "event",
            message: {
                type: type,
                args: args
            }
        };
    }
}
//# sourceMappingURL=MessageFactory.js.map