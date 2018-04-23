import * as WebSocket from "ws";

import {ErrorCodes} from "./communication/ErrorCodes";
import {GameController} from "./game/GameController";
import {ConnectMessage, Message, MESSAGE_TYPES, MoveMessage} from "./communication/Messages";
import {GameStatus} from "./game/enums";
import {isValidConnectMessage, isValidMessage, isValidMoveMessage} from "./communication/messagesValidator";

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
                if (gameController.currentPlayer.id !== (<MoveMessage>msg).playerId) {
                    server.emit("gameError", ErrorCodes.invalidPlayerId, ws);
                    return
                }

                // check if player can move

                gameController.moveCurrentPlayer((<MoveMessage>msg).move);

                if(gameController.status == GameStatus.FINISHED ) {
                    // broadcast
                }

                // tryb 1. sleep
                // tryb 2. return and wait for  msg nextMove
                // tryb 3. just go with next req

                gameController.nextMove();

                break;

            case MESSAGE_TYPES.NextMove:
                console.log("Next Move");
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
