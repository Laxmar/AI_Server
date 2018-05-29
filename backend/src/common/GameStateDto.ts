import Player from "../game/Player";
import GameMap from "../game/GameMap";
import {PlayerDto} from "./PlayerDto";
import {GameMapDto} from "./GameMapDto";
import {Point} from "../game/Point";

export interface GameStateDto {
    players: PlayerDto[];
    flag: Point;
}