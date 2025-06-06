import ArithmeticSequence from "../../math/pub/ArithmeticSequence.js";
import StringSequence from "../../strings/pub/StringSequence.js";
import Mediator from "./Mediator.js";
import Room from "./Room.js";
/**
 * An IRoom where the ids within the room
 * are pseudonymous ids that are newly generated
 * for each messenger joining the room.
 */
export default class DiscreetRoom {
    constructor(code, mediator = new Mediator(), messengerIds = new Set()) {
        this.code = code;
        this.mediator = mediator;
        this.messengerIds = messengerIds;
        this.aliasGenerator = new StringSequence(new ArithmeticSequence());
        this.aliases = {};
        this.room = new Room(code, mediator, messengerIds);
    }
    isInRoom(messengerId) {
        var alias = this.aliases[messengerId];
        return (alias !== undefined && this.room.isInRoom(alias));
    }
    join(messengerId, messenger) {
        if (this.aliases[messengerId] !== undefined) {
            throw new Error(`A messenger with id ${messengerId} already exists in Room.`);
        }
        const alias = this.aliasGenerator.next();
        this.aliases[messengerId] = alias;
        this.room.join(alias, messenger);
        return this;
    }
    leave(messengerId) {
        if (this.aliases[messengerId] === undefined) {
            throw new Error(`A messenger with id ${messengerId} does not exist in Room.`);
        }
        const alias = this.aliases[messengerId];
        delete this.aliases[messengerId];
        this.room.leave(alias);
        return this;
    }
}
//# sourceMappingURL=DiscreetRoom.js.map