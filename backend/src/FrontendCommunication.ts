import * as WebSocket from "ws";
import {ConnectMessage} from "./communication/incomingMessages";
import {PlayerDto} from "./common/PlayerDto";
import {GameMapDto} from "./common/GameMapDto";
import {GameStatus} from "./game/enums";
import {GameStateDto} from "./common/GameStateDto";
import Player from "./game/Player";

export class FrontendCommunication {

    private sockets: WebSocket[] = [];

    private readonly frontClientName = "FrontClient";

    constructor() {

    }

    addClient(socket: WebSocket) {
        this.sockets.push(socket);
    }

    isFrontClient(msg: ConnectMessage) {
        return msg.name === this.frontClientName;
    }

    public send(msg: any) {
        this.sockets.forEach( socket => {
            if(socket.readyState === socket.OPEN) {
                socket.send(msg);
            }
        })
    }

    public sendGameState(players: Player[], gameMap: GameMapDto) {

        let playersDto: PlayerDto[] = players.map( p => p.getPlayerDto());

        let gameState: GameStateDto = {
            players: playersDto,
            map: gameMap
        };

        this.send(JSON.stringify(gameState));
    }
}