"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameMap = /** @class */ (function () {
    function GameMap(width, height) {
        this.map = [];
        this.width = width;
        this.height = height;
        this.generateMap();
    }
    // TODO generateMap with perlin noise alg
    GameMap.prototype.generateMap = function () {
        for (var i = 0; i < this.height; i++) {
            this.map.push([]);
            for (var j = 0; j < this.width; j++) {
                this.map[i].push(1);
            }
        }
    };
    return GameMap;
}());
exports.default = GameMap;
