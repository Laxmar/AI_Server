import {Point} from "../game/Point";

export interface PlayerDto {
    id: number;
    hasFlag: boolean;
    isAlive: boolean;
    name: string;
    maxMovesPerRound: number;
    basePosition: Point;
    viewRange: number;
    movesLeft: number;
    x: number;
    y: number;
}