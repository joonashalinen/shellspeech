import MessageFactory from "../../messaging/pub/MessageFactory.js";
/**
 * A service that is completely open to custom
 * modification by outsiders.
 */
export default class OpenService {
    constructor(service) {
        this.service = service;
    }
    /**
     * Modify the class with a given function
     * that is allowed to do anything to the class.
     */
    modify(modifier) {
        return modifier.f.bind(this)(...modifier.boundArgs);
    }
    /**
     * Listen to an event via a given function.
     * The given function 'listener' is given a function 'sendMsg', which
     * 'listener' can call when it wants to send back an event message
     * to the listening service.
     */
    listen(listeningService, listener) {
        const messageFactory = new MessageFactory(this.service.id);
        const sendMsg = (eventName, event) => this.service.proxyMessenger.postMessage(messageFactory.createEvent(listeningService, eventName, [event]));
        listener.f.bind(this.service)(sendMsg.bind(this), ...listener.boundArgs);
    }
}
//# sourceMappingURL=OpenService.js.map