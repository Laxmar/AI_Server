import {MoveDirections} from "../game/enums";

export enum IncomingMessagesTypes {
    Connect = "Connect",
    Move = "Move",
    NextMove = "NextMove",
    GameRestart = "GameRestart"
}

export abstract class IncomingMessage {
    type: IncomingMessagesTypes
}

export class ConnectMessage extends IncomingMessage {
    type: IncomingMessagesTypes = IncomingMessagesTypes.Connect;
    name: string;
}

export class MoveMessage extends IncomingMessage {
    type: IncomingMessagesTypes = IncomingMessagesTypes.Move;
    move: MoveDirections;
    playerId: number;
}

export class RestartGameMessage extends IncomingMessage {
    type: IncomingMessagesTypes = IncomingMessagesTypes.GameRestart;
    token: number;
}

