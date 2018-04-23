export enum RESPONSE_TYPES {
    Error = "Error",
    OK = "OK",
}

abstract class Response {
    status: string;
}

class ErrorResponse extends Response {
    status: string = "Error";
    msg: string;
}

