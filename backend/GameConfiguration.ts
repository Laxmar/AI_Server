import {GameMode} from "./game/enums";

export class GameConfiguration {
    static readonly maxMovesPerRound: number = 5;
    static readonly fieldOfView: number = 5;
    static readonly maxPlayers = 2;                     // Game starts when all players connected
    static readonly carryingFlagMoveCost = 0.5;
    static readonly gameMode: GameMode = GameMode.DELAY;
    static readonly delay: number = 500;                // [ms]
    static readonly mapWidth = 5;
    static readonly mapHeight = 5;
}