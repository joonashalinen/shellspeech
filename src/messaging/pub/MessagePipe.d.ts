import type IMessenger from "./IMessenger.d.ts";
/**
 * Can be used to join two IMessengers so that messages received from either one are
 * forwarded to the other one.
 */
export default class MessagePipe<A, B> {
    messenger1: IMessenger<A, B>;
    messenger2: IMessenger<B, A>;
    constructor(messenger1: IMessenger<A, B>, messenger2: IMessenger<B, A>);
    /**
     * Joins the two IMessengers.
     */
    join(): MessagePipe<A, B>;
}
