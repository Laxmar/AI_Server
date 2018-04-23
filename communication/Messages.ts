import {MoveDirections} from "../game/enums";

export enum MESSAGE_TYPES {
    Connect = "Connect",
    Move = "Move",
    NextMove = "NextMove"
}

export abstract class Message {
    type: MESSAGE_TYPES
}

export class ConnectMessage extends Message {
    name: string;
}

export class MoveMessage extends Message {
    move: MoveDirections;
    playerId: number;
}

