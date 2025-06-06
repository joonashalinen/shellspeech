import ArithmeticSequence from "../../math/pub/ArithmeticSequence.js";
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
    room: Room;
    aliasGenerator = new StringSequence(new ArithmeticSequence());
    aliases: {[messengerId: string]: string} = {};

    constructor(
        public code: string,
        public mediator = new Mediator(),
        public messengerIds = new Set<string>()
    ) {
        this.room = new Room(code, mediator, messengerIds);
    }

    isInRoom(messengerId: string): boolean {
        var alias = this.aliases[messengerId];
        return (alias !== undefined && this.room.isInRoom(alias));
    }

    join(messengerId: string, messenger: IMessenger<DMessage, DMessage>): IRoom {
        if (this.aliases[messengerId] !== undefined) {
            throw new Error(`A messenger with id ${messengerId} already exists in Room.`);
        }
        const alias = this.aliasGenerator.next();
        this.aliases[messengerId] = alias;
        this.room.join(alias, messenger);
        return this;
    }

    leave(messengerId: string): IRoom {
        if (this.aliases[messengerId] === undefined) {
            throw new Error(`A messenger with id ${messengerId} does not exist in Room.`);
        }
        const alias = this.aliases[messengerId];
        delete this.aliases[messengerId];
        this.room.leave(alias);
        return this;
    }
}