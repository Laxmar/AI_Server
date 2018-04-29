"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var ErrorCodes_1 = require("./communication/ErrorCodes");
var GameController_1 = require("./game/GameController");
var incomingMessages_1 = require("./communication/incomingMessages");
var messagesValidator_1 = require("./communication/messagesValidator");
var GameConfiguration_1 = require("./GameConfiguration");
var serverResponses_1 = require("./communication/serverResponses");
var FrontendCommunication_1 = require("./FrontendCommunication");
var port = 8000;
var server = new WebSocket.Server({ port: port }, function () {
    console.log("Server listening on " + port);
});
var gameController = new GameController_1.GameController();
var frontCommunication = new FrontendCommunication_1.FrontendCommunication();
server.on('connection', function connection(ws) {
    console.log("There are " + server.clients.size + " clients connected");
    ws.on('message', function incoming(message) {
        console.log('received: ', message);
        if (!messagesValidator_1.isValidMessage(message)) {
            server.emit("gameError", ErrorCodes_1.ErrorCodes.invalidMessage, ws);
            return;
        }
        var msg = JSON.parse(message);
        switch (msg.type) {
            case incomingMessages_1.IncomingMessagesTypes.Connect:
                if (!messagesValidator_1.isValidConnectMessage(msg)) {
                    server.emit("gameError", ErrorCodes_1.ErrorCodes.invalidConnectMessage, ws);
                    return;
                }
                if (frontCommunication.isFrontClient(msg)) {
                    frontCommunication.addClient(ws);
                    return;
                }
                if (gameController.status != "NOT_STARTED" /* NOT_STARTED */) {
                    server.emit("gameError", ErrorCodes_1.ErrorCodes.gameAlreadyStarted, ws);
                    return;
                }
                // Ugly hack here should send ConnectResponse after addPlayer but it will break in case testing with 1 player
                // TODO add testMode and fix this hack
                var nextPlayerId = gameController.players.length;
                ws.send(JSON.stringify(new serverResponses_1.ConnectResponse(nextPlayerId)));
                gameController.addPlayer(msg.name, ws);
                break;
            case incomingMessages_1.IncomingMessagesTypes.Move:
                if (!messagesValidator_1.isValidMoveMessage(msg)) {
                    server.emit("gameError", ErrorCodes_1.ErrorCodes.invalidMoveMessage, ws);
                    return;
                }
                var moveMsg = msg;
                if (gameController.currentPlayer.id !== moveMsg.playerId) {
                    server.emit("gameError", ErrorCodes_1.ErrorCodes.invalidPlayerId, ws);
                    return;
                }
                if (!gameController.isValidMoveForCurrentPlayer(moveMsg.move)) {
                    server.emit("gameError", ErrorCodes_1.ErrorCodes.invalidMove, ws);
                    gameController.currentPlayer.setToMovesLeftToZero();
                    gameController.nextMove();
                    return;
                }
                gameController.moveCurrentPlayer(moveMsg.move);
                console.log("Player moved");
                frontCommunication.send(JSON.stringify(gameController.currentPlayer.getPlayerDataForSend()));
                ws.send(JSON.stringify(new serverResponses_1.ResponseOK()));
                if (gameController.status == "FINISHED" /* FINISHED */) {
                    server.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: "GameOver" }));
                            return;
                        }
                    });
                }
                if (GameConfiguration_1.GameConfiguration.gameMode == "MANUAL" /* MANUAL */) {
                    return;
                }
                if (GameConfiguration_1.GameConfiguration.gameMode == "DELAY" /* DELAY */) {
                    setTimeout(gameController.nextMove.bind(gameController), GameConfiguration_1.GameConfiguration.delay);
                    return;
                }
                if (GameConfiguration_1.GameConfiguration.gameMode == "AUTO" /* AUTO */) {
                    gameController.nextMove();
                }
                break;
            case incomingMessages_1.IncomingMessagesTypes.NextMove:
                gameController.nextMove();
                break;
            default:
                server.emit("gameError", ErrorCodes_1.ErrorCodes.invalidMessageType, ws);
        }
    });
    ws.on('close', function () {
        console.log('Closing socket');
    });
    ws.on("error", function (err) {
        console.log(err);
        ws.send(err);
    });
});
server.on("gameError", function (errorCode, ws) {
    console.log(errorCode);
    ws.send(JSON.stringify(new serverResponses_1.ErrorResponse(errorCode)));
});
server.on("error", function (err) {
    console.log(err);
});
