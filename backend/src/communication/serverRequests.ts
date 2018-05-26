import Player from "../game/Player";
import {Point} from "../game/Point";
import {PlayerDto} from "../common/PlayerDto";

export const enum ServerRequestsTypes  {
    MoveRequest = "MoveRequest"
}

export class MoveRequest {
    readonly type: ServerRequestsTypes = ServerRequestsTypes.MoveRequest;
    map: number[][];
    players: PlayerDto[];
    flag: Point;

    constructor(map: number[][], visiblePlayers: PlayerDto[], flagPosition: Point) {
        this.map = map;
        this.players = visiblePlayers;
        this.flag = flagPosition;
    }
}