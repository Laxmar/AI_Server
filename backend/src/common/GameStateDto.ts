import Player from "../game/Player";
import GameMap from "../game/GameMap";
import {PlayerDto} from "./PlayerDto";
import {GameMapDto} from "./GameMapDto";

export interface GameStateDto {
    players: PlayerDto[];
}