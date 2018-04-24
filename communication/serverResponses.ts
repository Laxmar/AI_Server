import {IncomingMessage} from "./incomingMessages";
import {ErrorCodes} from "./ErrorCodes";

enum ResponseTypes  {
    ResponseOK = "ResponseOK",
    Error = "Error"
}

export class ResponseOK {
    type: ResponseTypes = ResponseTypes.ResponseOK;
    msg: string = "OK";
}

export class ErrorResponse {
    type: ResponseTypes = ResponseTypes.Error;
    msg: ErrorCodes;

    constructor(errCode: ErrorCodes) {
        this.msg = errCode;
    }
}

