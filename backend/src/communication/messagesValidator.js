"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var incomingMessages_1 = require("./incomingMessages");
var util_1 = require("util");
var enums_1 = require("../game/enums");
function isValidMessage(msg) {
    var msgJSON;
    try {
        msgJSON = JSON.parse(msg);
    }
    catch (e) {
        return false;
    }
    return msgJSON.type != undefined;
}
exports.isValidMessage = isValidMessage;
function isValidConnectMessage(msg) {
    return msg.type == incomingMessages_1.IncomingMessagesTypes.Connect && msg.name;
}
exports.isValidConnectMessage = isValidConnectMessage;
function isValidMoveMessage(msg) {
    return msg.type == incomingMessages_1.IncomingMessagesTypes.Move && util_1.isNumber(msg.playerId) && enums_1.MoveDirectionsArray.includes(msg.move);
}
exports.isValidMoveMessage = isValidMoveMessage;
