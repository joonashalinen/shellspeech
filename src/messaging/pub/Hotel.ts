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
    rooms: IRoom[] = [];
    mediator = new Mediator();
    emitter = new EventEmitter();
    createRoom = (code: string) => new Room(code);

    constructor() {

    }

    /**
     * Whether given messenger is already in a room.
     */
    isInRoom(messengerId: string) {
        const room = this.rooms.find((r) => r.isInRoom(messengerId));
        return (room !== undefined);
    }

    /**
     * Whether there is a room that can be joined with the given code.
     */
    roomWithCodeExists(code: string) {
        const room = this.rooms.find((r) => r.code === code);
        return (room !== undefined);
    }

    /**
     * Host a new room and return the room code.
     */
    hostRoom(): string {
        const code = this.generateRoomCode();
        const newRoom = this.createRoom(code);
        this.rooms.push(newRoom);
        return code;
    }

    /**
     * Join an existing room using the provided room code.
     * Returns true if the join was successful, false otherwise.
     */
    joinRoom(code: string, messengerId: string, messenger: IMessenger<DMessage, DMessage>): boolean {
        const room = this.rooms.find((r) => r.code === code);
        if (room !== undefined) {
            room.join(messengerId, messenger);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Removes messenger from all rooms they are in if they are in any.
     */
    leaveAllRooms(messengerId: string): boolean {
        const rooms = this.rooms.filter((r) => r.isInRoom(messengerId));
        rooms.forEach((room) => {
            if (room) {
                room.leave(messengerId);
            }
        });
        return true;
    }

    /**
     * Generate a random room code.
     */
    private generateRoomCode(): string {
        // Note: the upper case character 'O' and the number '0' are omitted 
        // from the code's possible characters to prevent users from confusing 
        // them with each other.
        const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
        const codeLength = 6;
        let code = "";

        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }

        if (this.rooms.find((room) => room.code === code)) {
            return this.generateRoomCode();
        } else {
            return code;
        }
    }
}
