import * as WebSocket from "ws";
import {MoveDirections} from "./enums";
import GameMap from "./GameMap";
import {Point} from "./Point";
import {MoveRequest} from "../communication/serverRequests";
import FieldOfView from "./FieldOfView";
import {PlayerDto} from "../common/PlayerDto";
import {GameMapDto} from "../common/GameMapDto";

export default class Player {
    public readonly id: number;
    public hasFlag: boolean;
    public isAlive: boolean;

    private readonly name: string;
    private readonly maxMovesPerRound: number;
    private readonly basePosition: Point;
    private readonly viewRange: number;

    private movesLeft: number;
    private x: number;
    private y: number;

    private socket: WebSocket;
    private map: GameMap;

    constructor(id: number, name: string, socket: WebSocket, maxMovesPerRound: number, viewRange: number, startingPosition: Point, map: GameMap) {
        this.id = id;
        this.name = name;
        this.socket = socket;
        this.maxMovesPerRound = maxMovesPerRound;
        this.viewRange = viewRange;
        this.basePosition = new Point(startingPosition.x, startingPosition.y);
        this.map = map;
        this.spawn();
    }

    getPlayerDto(): PlayerDto {
        return {
            id: this.id,
            hasFlag: this.hasFlag,
            isAlive: this.isAlive,
            name: this.name,
            maxMovesPerRound: this.maxMovesPerRound,
            basePosition: this.basePosition,
            viewRange: this.viewRange,
            movesLeft: this.movesLeft,
            x: this.x,
            y: this.y
        }
    }

    getPosition(): Point {
        return new Point(this.x, this.y);
    }

    spawn() {
        this.x = this.basePosition.x;
        this.y = this.basePosition.y;
        this.isAlive = true;
        this.hasFlag = false;
        this.movesLeft = this.maxMovesPerRound;
    }


    getMovesLeft(): number {
        return this.movesLeft;
    }

    setToMovesLeftToZero(): void {
        this.movesLeft = 0;
    }

    resetMovePoints(): void {
        this.movesLeft = this.maxMovesPerRound;
    }

    isPlayerInBase(): boolean {
        return this.x == this.basePosition.x && this.y == this.basePosition.y;
    }

    sendMoveRequest(players: Player[], flag: Point): void {
        const playerPosition = new Point(this.x, this.y);
        const fieldOfView: FieldOfView = new FieldOfView(playerPosition, this.viewRange);

        const visibleMap = this.map.calculateVisibleMap(fieldOfView);
        const visiblePlayer = players.filter( p => fieldOfView.isPointVisible( new Point(p.x, p.y) ));

        const playersData: PlayerDto[] = visiblePlayer.map(p => p.getPlayerDto());
        const gameMapDto: GameMapDto = {
            width: this.map.width,
            height: this.map.height,
            fields: visibleMap
        };
        const moveRequest: MoveRequest = new MoveRequest(gameMapDto, playersData, flag);

        this.socket.send(JSON.stringify(moveRequest));
    }

    calculateNextPosition(direction: MoveDirections): Point {
        const position: Point = new Point(this.x, this.y);

        switch (direction) {
            case MoveDirections.DOWN:
                position.y += 1;
                break;
            case MoveDirections.UP:
                position.y -= 1;
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
        this.x = nextPosition.x;
        this.y = nextPosition.y;
        this.movesLeft -= moveCost;
    }

    kill() {
        this.isAlive = false;
        this.hasFlag = false;
    }
}