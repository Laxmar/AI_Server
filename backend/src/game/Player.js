"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point_1 = require("./Point");
var serverRequests_1 = require("../communication/serverRequests");
var Player = /** @class */ (function () {
    function Player(id, name, socket, maxMovesPerRound, fieldOfView) {
        this.id = id;
        this.name = name;
        this.socket = socket;
        this.movesLeft = maxMovesPerRound;
        this.maxMovesPerRound = maxMovesPerRound;
        this.fieldOfView = fieldOfView;
        this.setStartPosition();
        this.basePosition = new Point_1.Point(this.x, this.y);
        this.hasFlag = false;
        this.isAlive = true;
    }
    Player.prototype.getPlayerDataForSend = function () {
        var playerWithoutSocket = Object.assign({}, this);
        delete playerWithoutSocket.socket;
        return playerWithoutSocket;
    };
    Player.prototype.getMovesLeft = function () {
        return this.movesLeft;
    };
    Player.prototype.setToMovesLeftToZero = function () {
        this.movesLeft = 0;
    };
    Player.prototype.resetMovePoints = function () {
        this.movesLeft = this.maxMovesPerRound;
    };
    Player.prototype.isPlayerInBase = function () {
        return this.x == this.basePosition.x && this.y == this.basePosition.y;
    };
    Player.prototype.sendMoveRequest = function (players, map, flag) {
        // TODO calculate visible map
        // send whole gameMap
        // -1 when bot cannot see field
        var visibleMap = map;
        // TODO show only visible players
        var playersData = players.map(function (p) { return p.getPlayerDataForSend(); });
        var moveRequest = new serverRequests_1.MoveRequest(visibleMap, playersData, flag);
        this.socket.send(JSON.stringify(moveRequest));
    };
    Player.prototype.calculateNextPosition = function (direction) {
        var position = new Point_1.Point(this.x, this.y);
        switch (direction) {
            case "DOWN" /* DOWN */:
                position.y -= 1;
                break;
            case "UP" /* UP */:
                position.y += 1;
                break;
            case "RIGHT" /* RIGHT */:
                position.x += 1;
                break;
            case "LEFT" /* LEFT */:
                position.x -= 1;
                break;
            case "NO_MOVE" /* NO_MOVE */:
                break;
        }
        return position;
    };
    Player.prototype.move = function (nextPosition, moveCost) {
        if (this.x == nextPosition.x && this.y == nextPosition.y) {
            this.movesLeft = 0;
            return;
        }
        this.x = nextPosition.x;
        this.y = nextPosition.y;
        this.movesLeft -= moveCost;
    };
    // TODO implement depends of player id
    Player.prototype.setStartPosition = function () {
        this.x = 0;
        this.y = 0;
    };
    return Player;
}());
exports.default = Player;
