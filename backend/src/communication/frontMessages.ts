import {GameStateDto} from "../common/GameStateDto";

export enum FrontMessages  {
    GameStateUpdate = "GameStateUpdate",
}

export class GameStateUpdateMessage {
    type: string = FrontMessages.GameStateUpdate;
    gameState: GameStateDto;

    constructor(gameState: GameStateDto) {
        this.gameState = gameState;
    }

}
