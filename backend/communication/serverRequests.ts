import Player from "../game/Player";
import {Point} from "../game/Point";

export const enum ServerRequestsTypes  {
    MoveRequest = "MoveRequest"
}

export class MoveRequest {
    readonly type: ServerRequestsTypes = ServerRequestsTypes.MoveRequest
    map: number[][];
    players: Player[];
    flag: Point;

    constructor(map: number[][], visiblePlayers: Player[], flagPosition: Point) {
        this.map = map;
        this.players = visiblePlayers;
        this.flag = flagPosition;
    }
}