import {Message, MESSAGE_TYPES} from "./Messages";
import {isNumber} from "util";
import {MoveDirectionsArray} from "../game/enums";

export function isValidMessage (msg: string): boolean {
    let msgJSON: Message;

    try {
        msgJSON = JSON.parse(msg);
    }catch (e) {
        return false;
    }
    return msgJSON.type != undefined;
}

export function isValidConnectMessage(msg: any): boolean {
    return msg.type == MESSAGE_TYPES.Connect && msg.name;
}

export function isValidMoveMessage(msg: any): boolean {
    return msg.type == MESSAGE_TYPES.Move && isNumber(msg.playerId) && MoveDirectionsArray.includes(msg.move);
}
