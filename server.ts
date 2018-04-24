import * as WebSocket from "ws";

import {ErrorCodes} from "./communication/ErrorCodes";
import {GameController} from "./game/GameController";
import {ConnectMessage, Message, MESSAGE_TYPES, MoveMessage} from "./communication/Messages";
import {GameMode, GameStatus} from "./game/enums";
import {isValidConnectMessage, isValidMessage, isValidMoveMessage} from "./communication/messagesValidator";
import {GameConfiguration} from "./GameConfiguration";

const port: number = 8000;

const server = new WebSocket.Server({port: port} , () => {
    console.log(`Server listening on ${port}`);
});


const gameController: GameController = new GameController();

server.on('connection', function connection(ws: WebSocket) {

    console.log("There are clients connected: ", server.clients.size);

    ws.on('message', function incoming(message: string) {
        console.log('received: ', message);

        if(!isValidMessage(message)) {
            server.emit("gameError", ErrorCodes.invalidMessage, ws);
            return;
        }

        const msg: Message = JSON.parse(message);

        switch (msg.type) {
            case MESSAGE_TYPES.Connect:
                if(!isValidConnectMessage(msg)) {
                    server.emit("gameError", ErrorCodes.invalidConnectMessage, ws);
                    return;
                }

                if(gameController.status != GameStatus.NOT_STARTED) {
                    server.emit("gameError", ErrorCodes.gameAlreadyStarted, ws);
                    return;
                }

                ws.send(JSON.stringify("OK"));
                gameController.addPlayer((<ConnectMessage>msg).name, ws);

                break;

            case MESSAGE_TYPES.Move:
                if(!isValidMoveMessage(msg)) {
                    server.emit("gameError", ErrorCodes.invalidMoveMessage, ws);
                    return;
                }

                const moveMsg: MoveMessage = <MoveMessage>msg;
                if (gameController.currentPlayer.id !== moveMsg.playerId) {
                    server.emit("gameError", ErrorCodes.invalidPlayerId, ws);
                    return
                }
                if (gameController.isValidMoveForCurrentPlayer(moveMsg.move)) {
                    server.emit("gameError", ErrorCodes.invalidMove, ws);
                    return;
                }

                gameController.moveCurrentPlayer(moveMsg.move);

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
                    setTimeout(gameController.nextMove, GameConfiguration.delay);
                    return
                }
                if(GameConfiguration.gameMode == GameMode.AUTO) {
                    gameController.nextMove();
                }
                break;

            case MESSAGE_TYPES.NextMove:
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
    ws.send(errorCode)

});

server.on("error", (err) => {
    console.log(err);
});
