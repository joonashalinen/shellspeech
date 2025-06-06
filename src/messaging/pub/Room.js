import Mediator from "./Mediator.js";
/**
 * A default implementation of IRoom.
 */
export default class Room {
    constructor(code, mediator = new Mediator(), messengerIds = new Set()) {
        this.code = code;
        this.mediator = mediator;
        this.messengerIds = messengerIds;
    }
    isInRoom(messengerId) {
        return this.messengerIds.has(messengerId);
    }
    join(messengerId, messenger) {
        if (this.messengerIds.has(messengerId)) {
            throw new Error(`A messenger with id ${messengerId} already exists in Room.`);
        }
        this.mediator.addActor(messengerId, messenger);
        this.messengerIds.add(messengerId);
        return this;
    }
    leave(messengerId) {
        if (!this.messengerIds.has(messengerId)) {
            throw new Error(`A messenger with id ${messengerId} does not exist in Room.`);
        }
        this.mediator.removeActor(messengerId);
        this.messengerIds.delete(messengerId);
        return this;
    }
}
//# sourceMappingURL=Room.js.map