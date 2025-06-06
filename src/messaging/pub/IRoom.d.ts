import type { DMessage } from "./DMessage.d.ts";
import type IMessenger from "./IMessenger.d.ts";
import Mediator from "./Mediator.js";
/**
 * A room for private messaging between IMessengers.
 */
export default interface IRoom {
    code: string;
    messengerIds: Set<string>;
    mediator: Mediator;
    /**
     * Whether messenger with given id
     * is in the room.
     */
    isInRoom(messengerId: string): boolean;
    /**
     * Joins the room and enables the messenger
     * to communicate within the room.
     */
    join(messengerId: string, messenger: IMessenger<DMessage, DMessage>): IRoom;
    /**
     * Remove given messenger from the room. They will no
     * longer be able to communicate within the room.
     */
    leave(messengerId: string): IRoom;
}
