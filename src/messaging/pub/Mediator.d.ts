import { IMediator } from "./IMediator.js";
import IMessenger from "./IMessenger.js";
import EventEmitter from "../../events/pub/EventEmitter.js";
import type { DMessage } from "./DMessage.d.ts";
import type IEventable from "../../events/pub/IEventable.d.ts";
type Actor = IMessenger<DMessage, DMessage>;
type Actors = {
    [name: string]: Actor;
};
/**
 * Default implementation for IMediator. Facilitates sending messages
 * between different actors which all implement the IMessenger interface.
 */
export default class Mediator implements IMediator, IEventable {
    emitter: EventEmitter;
    actors: Actors;
    actorListeners: {
        [actor: string]: (msg: DMessage) => void;
    };
    constructor(actors?: Actors);
    /**
     * Set up message listener for given actor. When the actor
     * emits a message, it is posted to the actors it is directed to.
     */
    _listenToActor(name: string, actor: Actor): void;
    /**
     * Post message to actor and trigger our own event
     * to signal that the message has been sent to all that may be
     * interested in this fact.
     */
    _postActorMessage(name: string, actor: Actor, msg: DMessage): void;
    addActor(id: string, actor: Actor): this;
    removeActor(id: string): this;
    /**
     * Listen to messages sent to given actor. Note: use this method only to listen
     * to actors other than yourself. An actor does not need to explicitly
     * listen to its own message events, since they will automatically receive
     * messages sent to them via .postMessage() simply by being a part of the Mediator's actors.
     * Consequently, only listen to messages for '*' (all actors) if you are not an actor.
     */
    onMessageFor(actor: string, handler: (msg: DMessage) => void): Mediator;
    offMessageFor(actor: string, handler: (msg: DMessage) => void): Mediator;
    postMessage(msg: DMessage, callerActor?: string): Mediator;
    onMessage(handler: (msg: DMessage) => void): Mediator;
    offMessage(handler: (msg: DMessage) => void): Mediator;
}
export {};
