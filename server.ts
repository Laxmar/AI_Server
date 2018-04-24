import * as WebSocket from "ws";

import {ErrorCodes} from "./communication/ErrorCodes";
import {GameController} from "./game/GameController";
import {ConnectMessage, IncomingMessage, IncomingMessagesTypes, MoveMessage} from "./communication/incomingMessages";
import {GameMode, GameStatus} from "./game/enums";
import {isValidConnectMessage, isValidMessage, isValidMoveMessage} from "./communication/messagesValidator";
import {GameConfiguration} from "./GameConfiguration";
import {ErrorResponse, ResponseOK} from "./communication/serverResponses";

const port: number = 8000;

const server = new WebSocket.Server({port: port} , () => {
    console.log(`Server listening on ${port}`);
});

const gameController: GameController = new GameController();

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

                if(gameController.status != GameStatus.NOT_STARTED) {
                    server.emit("gameError", ErrorCodes.gameAlreadyStarted, ws);
                    return;
                }

                ws.send(JSON.stringify(new ResponseOK()));
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

                console.log("Player moved");
                console.log(gameController.currentPlayer.getPlayerDataForSend());

                ws.send(JSON.stringify(new ResponseOK()));

                if(gameController.status == GameStatus.FINISHED ) {
                    server.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send("GameOver");
                        }
                    })
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

server.on("error", (err) => {
    console.log(err);
});
