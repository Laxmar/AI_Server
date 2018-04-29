"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfiguration = /** @class */ (function () {
    function GameConfiguration() {
    }
    GameConfiguration.maxMovesPerRound = 5;
    GameConfiguration.fieldOfView = 5;
    GameConfiguration.maxPlayers = 2; // Game starts when all players connected
    GameConfiguration.carryingFlagMoveCost = 0.5;
    GameConfiguration.gameMode = "DELAY" /* DELAY */;
    GameConfiguration.delay = 500; // [ms]
    GameConfiguration.mapWidth = 5;
    GameConfiguration.mapHeight = 5;
    return GameConfiguration;
}());
exports.GameConfiguration = GameConfiguration;
