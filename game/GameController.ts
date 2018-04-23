import * as WebSocket from "ws";

import GameMap from "./GameMap";
import Player from "./Player";
import {GameStatus, MoveDirections} from "./enums";
import {Point} from "./Point";
import {GameConfiguration} from "./GameConfiguration";


export class GameController {
    players: Player[];
    gameMap: GameMap;
    status: GameStatus = GameStatus.NOT_STARTED;
    currentPlayer: Player;
    flagPosition: Point;

    private readonly maxPlayers: number = GameConfiguration.maxPlayers;

    constructor() {
        this.gameMap = new GameMap(100,100);
        this.flagPosition = new Point(50, 50);
        this.players = [];
    }

    addPlayer(name: string, socket: WebSocket): void {
        const playerId = this.players.length;
        const player = new Player(playerId, name, socket, GameConfiguration.maxMovesPerRound);

        this.players.push(player);
        if(this.players.length == this.maxPlayers) {
            this.startGame();
        }
    }

    moveCurrentPlayer(direction: MoveDirections) {
        const nextPosition: Point = this.currentPlayer.calculateNextPosition(direction);
        let moveCost: number = this.gameMap.map[nextPosition.x][nextPosition.y];
        moveCost = this.currentPlayer.hasFlag ? moveCost + GameConfiguration.carryingFlagMoveCost : moveCost;

        this.currentPlayer.move(nextPosition, moveCost);

        if(nextPosition === this.flagPosition) {
            this.currentPlayer.hasFlag = true;
        }

        if(this.currentPlayer.hasFlag) {
            this.flagPosition = nextPosition;
        }

        // TODO check if player kill player

        // TODO check if game is finished

    }

    nextMove(): void {
        if(this.currentPlayer.getMovesLeft() > 0) {
            this.currentPlayer.sendMoveRequest(this.players, this.gameMap.map, this.flagPosition);
        } else {
            this.changePlayer();
        }
    }

    private changePlayer(): void {
        const nextIndex = (this.players.length + 1) % this.players.length;
        this.currentPlayer = this.players[nextIndex];
        this.currentPlayer.resetMovePoints();
        this.nextMove();
    }

    private startGame(): void {
        this.status = GameStatus.IN_PROGRESS;
        this.currentPlayer = this.players[0];
        this.currentPlayer.sendMoveRequest(this.players, this.gameMap.map, this.flagPosition);
    }
}