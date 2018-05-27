import {IncomingMessage, IncomingMessagesTypes} from "./incomingMessages";
import {isNumber} from "util";
import {MoveDirectionsArray} from "../game/enums";

export function isValidMessage (msg: string): boolean {
    let msgJSON: IncomingMessage;

    try {
        msgJSON = JSON.parse(msg);
    }catch (e) {
        return false;
    }
    return msgJSON.type != undefined;
}

export function isValidConnectMessage(msg: any): boolean {
    return msg.type == IncomingMessagesTypes.Connect && msg.name;
}

export function isValidMoveMessage(msg: any): boolean {
    return msg.type == IncomingMessagesTypes.Move && isNumber(msg.playerId) && MoveDirectionsArray.includes(msg.move);
}

export function isValidRestartMessage(msg: any): boolean {
    return msg.type == IncomingMessagesTypes.GameRestart && isNumber(msg.token);
}
