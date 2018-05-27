import Player from "../game/Player";
import {Point} from "../game/Point";
import {PlayerDto} from "../common/PlayerDto";
import {GameMapDto} from "../common/GameMapDto";

export const enum ServerRequestsTypes  {
    MoveRequest = "MoveRequest"
}

export class MoveRequest {
    readonly type: ServerRequestsTypes = ServerRequestsTypes.MoveRequest;
    map: GameMapDto;
    players: PlayerDto[];
    flag: Point;

    constructor(map: GameMapDto, visiblePlayers: PlayerDto[], flagPosition: Point) {
        this.map = map;
        this.players = visiblePlayers;
        this.flag = flagPosition;
    }
}