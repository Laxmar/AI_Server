import {GameMode} from "./src/game/enums";

export class GameConfiguration {
    static readonly maxMovesPerRound: number = 7;
    static readonly viewRange: number = 5;
    static readonly maxPlayers = 2;                     // Game starts when all players connected
    static readonly carryingFlagMoveCost = 1.5;
    static readonly gameMode: GameMode = GameMode.DELAY;
    static readonly delay: number = 100;                // [ms]
    static readonly mapWidth = 75;
    static readonly mapHeight = 75;                     // should equal mapWidth ( at least for now)
}