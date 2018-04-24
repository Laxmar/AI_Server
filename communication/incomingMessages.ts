import {MoveDirections} from "../game/enums";

export enum IncomingMessagesTypes {
    Connect = "Connect",
    Move = "Move",
    NextMove = "NextMove"
}

export abstract class IncomingMessage {
    type: IncomingMessagesTypes
}

export class ConnectMessage extends IncomingMessage {
    name: string;
}

export class MoveMessage extends IncomingMessage {
    move: MoveDirections;
    playerId: number;
}

