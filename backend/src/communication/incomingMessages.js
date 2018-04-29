"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var IncomingMessagesTypes;
(function (IncomingMessagesTypes) {
    IncomingMessagesTypes["Connect"] = "Connect";
    IncomingMessagesTypes["Move"] = "Move";
    IncomingMessagesTypes["NextMove"] = "NextMove";
})(IncomingMessagesTypes = exports.IncomingMessagesTypes || (exports.IncomingMessagesTypes = {}));
var IncomingMessage = /** @class */ (function () {
    function IncomingMessage() {
    }
    return IncomingMessage;
}());
exports.IncomingMessage = IncomingMessage;
var ConnectMessage = /** @class */ (function (_super) {
    __extends(ConnectMessage, _super);
    function ConnectMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ConnectMessage;
}(IncomingMessage));
exports.ConnectMessage = ConnectMessage;
var MoveMessage = /** @class */ (function (_super) {
    __extends(MoveMessage, _super);
    function MoveMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MoveMessage;
}(IncomingMessage));
exports.MoveMessage = MoveMessage;
