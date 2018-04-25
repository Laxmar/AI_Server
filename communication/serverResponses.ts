import {IncomingMessage} from "./incomingMessages";
import {ErrorCodes} from "./ErrorCodes";

export enum ServerResponseTypes  {
    ResponseOK = "ResponseOK",
    Error = "Error",
    Connected = "Connected"
}

export class ResponseOK {
    type: ServerResponseTypes = ServerResponseTypes.ResponseOK;
    msg: string = "OK";
}

export class ErrorResponse {
    type: ServerResponseTypes = ServerResponseTypes.Error;
    msg: ErrorCodes;

    constructor(errCode: ErrorCodes) {
        this.msg = errCode;
    }
}

export class ConnectResponse {
    type: ServerResponseTypes = ServerResponseTypes.Connected;
    msg: string = "Connected";
    playerId: number;

    constructor(id: number) {
        this.playerId = id;
    }
}


