import * as WebSocket from "ws";

import {ErrorCodes} from "./src/communication/ErrorCodes";
import {GameController} from "./src/game/GameController";
import {
    ConnectMessage, IncomingMessage, IncomingMessagesTypes, MoveMessage,
    RestartGameMessage
} from "./src/communication/incomingMessages";
import {GameMode, GameStatus} from "./src/game/enums";
import {
    isValidConnectMessage, isValidMessage, isValidMoveMessage,
    isValidRestartMessage
} from "./src/communication/messagesValidator";
import {GameConfiguration} from "./GameConfiguration";
import {
    ConnectResponse, ErrorResponse, FrontConnectResponse, GameOverResponse,
    ResponseOK
} from "./src/communication/serverResponses";
import {FrontendCommunication} from "./src/FrontendCommunication";

const port: number = 8000;

const server = new WebSocket.Server({port: port} , () => {
    console.log(`Server listening on ws://localhost:${port}`);
});

const gameController: GameController = new GameController();
const frontCommunication: FrontendCommunication = new FrontendCommunication();
const adminToken: number = Math.floor((Math.random() * 1000));

server.on('connection', function connection(ws: WebSocket) {

    console.log(`There are ${server.clients.size} clients connected`);

    ws.on('message', function incoming(message: string) {
        console.log('received: ', message);

        if(!isValidMessage(message)) {
            server.emit("gameError", ErrorCodes.invalidMessage, ws);
            return;
        }

        const msg: IncomingMessage = JSON.parse(message);

        switch (msg.type) {
            case IncomingMessagesTypes.Connect:
                if(!isValidConnectMessage(msg)) {
                    server.emit("gameError", ErrorCodes.invalidConnectMessage, ws);
                    return;
                }

                if(frontCommunication.isFrontClient(<ConnectMessage>msg)) {
                    frontCommunication.addClient(ws);
                    const res = new FrontConnectResponse(gameController.gameMap.getMapDto(), adminToken);
                    ws.send(JSON.stringify(res));
                    return;
                }

                if(gameController.status != GameStatus.NOT_STARTED) {
                    server.emit("gameError", ErrorCodes.gameAlreadyStarted, ws);
                    return;
                }

                // Ugly hack here should send ConnectResponse after addPlayer but it will break in case testing with 1 player
                // TODO add testMode and fix this hack
                const nextPlayerId = gameController.players.length;
                ws.send(JSON.stringify(new ConnectResponse(nextPlayerId)));
                gameController.addPlayer((<ConnectMessage>msg).name, ws);

                break;

            case IncomingMessagesTypes.Move:
                if(!isValidMoveMessage(msg)) {
                    server.emit("gameError", ErrorCodes.invalidMoveMessage, ws);
                    return;
                }

                const moveMsg: MoveMessage = <MoveMessage>msg;

                if (gameController.currentPlayer.id !== moveMsg.playerId) {
                    server.emit("gameError", ErrorCodes.invalidPlayerId, ws);
                    return
                }
                if (!gameController.isValidMoveForCurrentPlayer(moveMsg.move)) {
                    server.emit("gameError", ErrorCodes.invalidMove, ws);
                    gameController.currentPlayer.setToMovesLeftToZero();
                    gameController.nextMove();
                    return;
                }

                gameController.moveCurrentPlayer(moveMsg.move);
                frontCommunication.sendGameState(gameController.players, gameController.flagPosition);

                ws.send(JSON.stringify(new ResponseOK()));

                if(gameController.status == GameStatus.FINISHED ) {
                    server.emit("gameOver");
                    return;
                }

                if(GameConfiguration.gameMode == GameMode.MANUAL) {
                    return;
                }
                if(GameConfiguration.gameMode == GameMode.DELAY) {
                    setTimeout( gameController.nextMove.bind(gameController), GameConfiguration.delay);
                    return
                }
                if(GameConfiguration.gameMode == GameMode.AUTO) {
                    gameController.nextMove();
                }
                break;

            case IncomingMessagesTypes.NextMove:
                gameController.nextMove();
                break;

            case IncomingMessagesTypes.GameRestart:

                if(!isValidRestartMessage(msg)) {
                    server.emit("gameError", ErrorCodes.invalidRestartMessage, ws);
                    return;
                }

                if((<RestartGameMessage>msg).token == adminToken && gameController.players.length > 0) {
                    gameController.restartGame();
                }
                break;

            default:
                server.emit("gameError", ErrorCodes.invalidMessageType, ws);
        }
    });

    ws.on('close', function() {
        console.log('Closing socket');
    });

    ws.on("error", (err) => {
        console.log(err);
        ws.send(err);
    });

});

server.on("gameError",(errorCode, ws) => {
    console.log(errorCode);
    ws.send(JSON.stringify(new ErrorResponse(errorCode)));

});

server.on("gameOver", () => {
    server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            const winner = gameController.currentPlayer.getPlayerDto();
            client.send(JSON.stringify(new GameOverResponse(winner)));
        }
    });
});

server.on("error", (err) => {
    console.log(err);
});
