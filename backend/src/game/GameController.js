"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameMap_1 = require("./GameMap");
var Player_1 = require("./Player");
var Point_1 = require("./Point");
var GameConfiguration_1 = require("../../GameConfiguration");
var GameController = /** @class */ (function () {
    function GameController() {
        this.status = "NOT_STARTED" /* NOT_STARTED */;
        this.maxPlayers = GameConfiguration_1.GameConfiguration.maxPlayers;
        this.gameMap = new GameMap_1.default(GameConfiguration_1.GameConfiguration.mapWidth, GameConfiguration_1.GameConfiguration.mapHeight);
        // TODO add placing a flag
        this.flagPosition = new Point_1.Point(5, 5);
        this.players = [];
    }
    GameController.prototype.addPlayer = function (name, socket) {
        var playerId = this.players.length;
        var player = new Player_1.default(playerId, name, socket, GameConfiguration_1.GameConfiguration.maxMovesPerRound, GameConfiguration_1.GameConfiguration.fieldOfView);
        this.players.push(player);
        if (this.players.length == this.maxPlayers) {
            this.startGame();
        }
    };
    GameController.prototype.isValidMoveForCurrentPlayer = function (direction) {
        var nextPosition = this.currentPlayer.calculateNextPosition(direction);
        var isPointOnTheMap = nextPosition.x >= 0 && nextPosition.x < this.gameMap.width && nextPosition.y < this.gameMap.height && nextPosition.y >= 0;
        if (!isPointOnTheMap) {
            return false;
        }
        var moveCost = this.calculateMoveCost(nextPosition, this.currentPlayer.hasFlag);
        return moveCost <= this.currentPlayer.getMovesLeft();
    };
    GameController.prototype.moveCurrentPlayer = function (direction) {
        var nextPosition = this.currentPlayer.calculateNextPosition(direction);
        var moveCost = this.calculateMoveCost(nextPosition, this.currentPlayer.hasFlag);
        this.currentPlayer.move(nextPosition, moveCost);
        if (nextPosition === this.flagPosition) {
            this.currentPlayer.hasFlag = true;
        }
        if (this.currentPlayer.hasFlag) {
            this.flagPosition = nextPosition;
        }
        // TODO check if player kill player
        // TODO add testing mode - maxPlayers = 1; makes sense just for testing purpose
        if (this.isGameOver() && GameConfiguration_1.GameConfiguration.maxPlayers > 1) {
            this.status = "FINISHED" /* FINISHED */;
        }
    };
    GameController.prototype.nextMove = function () {
        if (this.currentPlayer.getMovesLeft() > 0) {
            this.currentPlayer.sendMoveRequest(this.players, this.gameMap.map, this.flagPosition);
        }
        else {
            this.changePlayer();
        }
    };
    GameController.prototype.changePlayer = function () {
        var nextIndex = this.players.length == 1 ? 0 : (this.currentPlayer.id + 1) % this.players.length;
        this.currentPlayer = this.players[nextIndex];
        this.currentPlayer.resetMovePoints();
        this.nextMove();
    };
    GameController.prototype.startGame = function () {
        this.status = "IN_PROGRESS" /* IN_PROGRESS */;
        this.currentPlayer = this.players[0];
        this.currentPlayer.sendMoveRequest(this.players, this.gameMap.map, this.flagPosition);
    };
    GameController.prototype.calculateMoveCost = function (position, hasFlag) {
        var moveCost = this.gameMap.map[position.x][position.y];
        return hasFlag ? moveCost + GameConfiguration_1.GameConfiguration.carryingFlagMoveCost : moveCost;
    };
    GameController.prototype.isGameOver = function () {
        var isOnePlayerAlive = this.players.filter(function (p) { return p.isAlive; }).length == 1;
        return (this.currentPlayer.isPlayerInBase() && this.currentPlayer.hasFlag) || isOnePlayerAlive;
    };
    return GameController;
}());
exports.GameController = GameController;
