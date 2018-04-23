import * as WebSocket from "ws";
import {MoveDirections} from "./enums";
import GameMap from "./GameMap";
import {Point} from "./Point";
import {MoveRequest} from "../communication/Requests";

export default class Player {
    public readonly id: number;
    public hasFlag: boolean;

    private readonly name: string;
    private readonly maxMovesPerRound: number;
    private movesLeft: number;
    private x: number;
    private y: number;
    private isAlive: boolean;

    private socket: WebSocket;

    constructor(id: number, name: string, socket: WebSocket, maxMovesPerRound: number) {
        this.id = id;
        this.name = name;
        this.hasFlag = false;
        this.movesLeft = maxMovesPerRound;
        this.socket = socket;
        this.isAlive = true;
        this.setStartPosition();
    }

    getPlayerDataForSend(): Player {
        let playerWithoutSocket = Object.assign({}, this);
        delete playerWithoutSocket.socket;
        return playerWithoutSocket;
    }


    getMovesLeft(): number {
        return this.movesLeft;
    }

    resetMovePoints(): void {
        this.movesLeft = this.maxMovesPerRound;
    }

    sendMoveRequest(players: Player[], map: number[][], flag: Point): void {

        // TODO calulate visible map
        const visibleMap = map;

        // TODO check is player visible

        const playersData: Player[] = players.map(p => p.getPlayerDataForSend());
        const moveRequest: MoveRequest = new MoveRequest(visibleMap, playersData, flag);

        this.socket.send(JSON.stringify(moveRequest));
    }

    canMove(direction: MoveDirections, map: GameMap): boolean {
        // TODO

        // check gameMap boundaries

        // check if has enough movesPoint

        return true;
    }

    calculateNextPosition(direction: MoveDirections): Point {
        const position: Point = new Point(this.x, this.y);

        switch (direction) {
            case MoveDirections.DOWN:
                position.y -= 1;
                break;
            case MoveDirections.UP:
                position.y += 1;
                break;

            case MoveDirections.RIGHT:
                position.x += 1;
                break;

            case MoveDirections.LEFT:
                position.x -= 1;
                break;

            case MoveDirections.NO_MOVE:
                break;
        }
        return position;
    }

    move(nextPosition: Point , moveCost: number) {
        if(this.x == nextPosition.x && this.y == nextPosition.y) {
            this.movesLeft = 0;
            return;
        }
        this.x = nextPosition.x;
        this.y = nextPosition.y;
        this.movesLeft -= moveCost;
    }

    // TODO implement depends of player id
    private setStartPosition() {
        this.x = 0;
        this.y = 0;
    }

}