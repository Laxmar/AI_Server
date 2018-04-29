"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MoveRequest = /** @class */ (function () {
    function MoveRequest(map, visiblePlayers, flagPosition) {
        this.type = "MoveRequest" /* MoveRequest */;
        this.map = map;
        this.players = visiblePlayers;
        this.flag = flagPosition;
    }
    return MoveRequest;
}());
exports.MoveRequest = MoveRequest;
