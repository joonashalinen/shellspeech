import type { DMessage } from "./DMessage.d.ts";
import type IMessenger from "./IMessenger.d.ts";
import type IRoom from "./IRoom.d.ts";
import Mediator from "./Mediator.js";
/**
 * A default implementation of IRoom.
 */
export default class Room implements IRoom {
    code: string;
    mediator: Mediator;
    messengerIds: Set<string>;
    constructor(code: string, mediator?: Mediator, messengerIds?: Set<string>);
    isInRoom(messengerId: string): boolean;
    join(messengerId: string, messenger: IMessenger<DMessage, DMessage>): IRoom;
    leave(messengerId: string): IRoom;
}
