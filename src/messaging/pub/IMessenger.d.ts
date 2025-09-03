export default interface IMessenger<A, B> {
    /**
     * Post a message.
     */
    postMessage(msg: A): void;
    /**
     * Listen to incoming messages.
     */
    onMessage(handler: (msg: B) => void): void;
    /**
     * Remove listeners that were set with the given event handler.
     */
    offMessage(handler: (msg: B) => void): void;
}
