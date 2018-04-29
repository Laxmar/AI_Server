"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServerResponseTypes;
(function (ServerResponseTypes) {
    ServerResponseTypes["ResponseOK"] = "ResponseOK";
    ServerResponseTypes["Error"] = "Error";
    ServerResponseTypes["Connected"] = "Connected";
})(ServerResponseTypes = exports.ServerResponseTypes || (exports.ServerResponseTypes = {}));
var ResponseOK = /** @class */ (function () {
    function ResponseOK() {
        this.type = ServerResponseTypes.ResponseOK;
        this.msg = "OK";
    }
    return ResponseOK;
}());
exports.ResponseOK = ResponseOK;
var ErrorResponse = /** @class */ (function () {
    function ErrorResponse(errCode) {
        this.type = ServerResponseTypes.Error;
        this.msg = errCode;
    }
    return ErrorResponse;
}());
exports.ErrorResponse = ErrorResponse;
var ConnectResponse = /** @class */ (function () {
    function ConnectResponse(id) {
        this.type = ServerResponseTypes.Connected;
        this.msg = "Connected";
        this.playerId = id;
    }
    return ConnectResponse;
}());
exports.ConnectResponse = ConnectResponse;
