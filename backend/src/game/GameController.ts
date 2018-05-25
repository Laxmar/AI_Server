import * as WebSocket from "ws";

import GameMap from "./GameMap";
import Player from "./Player";
import {GameStatus, MoveDirections} from "./enums";
import {Point} from "./Point";
import {GameConfiguration} from "../../GameConfiguration";


export class GameController {
    players: Player[];
    gameMap: GameMap;
    status: GameStatus = GameStatus.NOT_STARTED;
    currentPlayer: Player;
    flagPosition: Point;

    private readonly maxPlayers: number = GameConfiguration.maxPlayers;

    constructor() {
        this.gameMap = new GameMap(GameConfiguration.mapWidth,GameConfiguration.mapHeight);
        this.flagPosition = this.gameMap.calculateMapCenter();
        this.players = [];
    }

    addPlayer(name: string, socket: WebSocket): void {
        const playerId = this.players.length;
        const playerStartingPosition: Point = this.calculatePlayerStartingPosition(playerId);
        const player = new Player(playerId, name, socket, GameConfiguration.maxMovesPerRound, GameConfiguration.viewRange,  playerStartingPosition, this.gameMap);

        this.players.push(player);
        if(this.players.length == this.maxPlayers) {
            this.startGame();
        }
    }

    isValidMoveForCurrentPlayer(direction: MoveDirections): boolean {
        const nextPosition: Point = this.currentPlayer.calculateNextPosition(direction);
        const isPointOnTheMap = nextPosition.x >= 0 && nextPosition.x < this.gameMap.width && nextPosition.y < this.gameMap.height && nextPosition.y >= 0;
        if(!isPointOnTheMap) {
            return false;
        }
        const moveCost: number = this.calculateMoveCost(nextPosition, this.currentPlayer.hasFlag);

        return moveCost <= this.currentPlayer.getMovesLeft();
    }

    moveCurrentPlayer(direction: MoveDirections): void {
        const nextPosition: Point = this.currentPlayer.calculateNextPosition(direction);
        const moveCost: number = this.calculateMoveCost(nextPosition, this.currentPlayer.hasFlag);

        this.currentPlayer.move(nextPosition, moveCost);

        if(nextPosition === this.flagPosition) {
            this.currentPlayer.hasFlag = true;
        }

        if(this.currentPlayer.hasFlag) {
            this.flagPosition = nextPosition;
        }

        // TODO check if player kill player

        // TODO add testing mode - maxPlayers = 1; makes sense just for testing purpose
        if(this.isGameOver() && GameConfiguration.maxPlayers > 1) {
            this.status = GameStatus.FINISHED;
        }
    }

    nextMove(): void {
        if(this.currentPlayer.getMovesLeft() > 0) {
            this.currentPlayer.sendMoveRequest(this.players, this.flagPosition);
        } else {
            this.changePlayer();
        }
    }

    private changePlayer(): void {
        const nextIndex = this.players.length == 1 ? 0 : (this.currentPlayer.id + 1) % this.players.length;
        this.currentPlayer = this.players[nextIndex];
        this.currentPlayer.resetMovePoints();
        this.nextMove();
    }

    private startGame(): void {
        this.status = GameStatus.IN_PROGRESS;
        this.currentPlayer = this.players[0];
        this.currentPlayer.sendMoveRequest(this.players, this.flagPosition);
    }

    private calculateMoveCost(position: Point, hasFlag: boolean): number {
        let moveCost: number = this.gameMap.map[position.x][position.y];
        return hasFlag ? moveCost + GameConfiguration.carryingFlagMoveCost : moveCost;
    }

    private isGameOver(): boolean {
        const isOnePlayerAlive = this.players.filter( p => p.isAlive).length == 1;
        return (this.currentPlayer.isPlayerInBase() && this.currentPlayer.hasFlag) || isOnePlayerAlive;
    }

    // TODO handle more players
    private calculatePlayerStartingPosition(playerNumber: number): Point {
        let x = 0;
        let y = 0;

        if(playerNumber == 0) {
            x = this.gameMap.width / 2;
            y = 0;
            return new Point(x, y);
        }
        if(playerNumber == 1) {
            x = this.gameMap.width / 2;
            y = this.gameMap.height-1;
        }
        return new Point(x,y);
    }
}