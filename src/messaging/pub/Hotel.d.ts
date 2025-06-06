import EventEmitter from "../../events/pub/EventEmitter.js";
import type { DMessage } from "./DMessage.d.ts";
import type IMessenger from "./IMessenger.d.ts";
import Mediator from "./Mediator.js";
import type IRoom from "./IRoom.d.ts";
import Room from "./Room.js";
/**
 * Provides the ability to create private rooms
 * for messaging between IMessengers. IMessengers can
 * either host their own rooms or join existing rooms
 * via a code shared by the room's host.
 */
export default class Hotel {
    rooms: IRoom[];
    mediator: Mediator;
    emitter: EventEmitter;
    createRoom: (code: string) => Room;
    constructor();
    /**
     * Whether given messenger is already in a room.
     */
    isInRoom(messengerId: string): boolean;
    /**
     * Whether there is a room that can be joined with the given code.
     */
    roomWithCodeExists(code: string): boolean;
    /**
     * Host a new room and return the room code.
     */
    hostRoom(): string;
    /**
     * Join an existing room using the provided room code.
     * Returns true if the join was successful, false otherwise.
     */
    joinRoom(code: string, messengerId: string, messenger: IMessenger<DMessage, DMessage>): boolean;
    /**
     * Removes messenger from all rooms they are in if they are in any.
     */
    leaveAllRooms(messengerId: string): boolean;
    /**
     * Generate a random room code.
     */
    private generateRoomCode;
}
