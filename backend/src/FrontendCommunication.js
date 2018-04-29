"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FrontendCommunication = /** @class */ (function () {
    function FrontendCommunication() {
        this.sockets = [];
        this.frontClientName = "FrontClient";
    }
    FrontendCommunication.prototype.addClient = function (socket) {
        this.sockets.push(socket);
    };
    FrontendCommunication.prototype.isFrontClient = function (msg) {
        return msg.name === this.frontClientName;
    };
    FrontendCommunication.prototype.send = function (msg) {
        this.sockets.forEach(function (socket) {
            if (socket.readyState === socket.OPEN) {
                socket.send(msg);
            }
        });
    };
    return FrontendCommunication;
}());
exports.FrontendCommunication = FrontendCommunication;
