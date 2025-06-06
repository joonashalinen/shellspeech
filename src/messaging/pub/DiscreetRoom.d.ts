import StringSequence from "../../strings/pub/StringSequence.js";
import type { DMessage } from "./DMessage.d.ts";
import type IMessenger from "./IMessenger.d.ts";
import type IRoom from "./IRoom.d.ts";
import Mediator from "./Mediator.js";
import Room from "./Room.js";
/**
 * An IRoom where the ids within the room
 * are pseudonymous ids that are newly generated
 * for each messenger joining the room.
 */
export default class DiscreetRoom implements IRoom {
    code: string;
    mediator: Mediator;
    messengerIds: Set<string>;
    room: Room;
    aliasGenerator: StringSequence;
    aliases: {
        [messengerId: string]: string;
    };
    constructor(code: string, mediator?: Mediator, messengerIds?: Set<string>);
    isInRoom(messengerId: string): boolean;
    join(messengerId: string, messenger: IMessenger<DMessage, DMessage>): IRoom;
    leave(messengerId: string): IRoom;
}
