import * as WebSocket from "ws";
import {ConnectMessage, IncomingMessagesTypes, IncomingMessage, MoveMessage} from "../communication/incomingMessages";
import {MoveDirections, MoveDirectionsArray} from "../game/enums";
import {ServerRequestsTypes} from "../communication/serverRequests";
import {ConnectResponse, ServerResponseTypes} from "../communication/serverResponses";

const url = "ws://localhost:8000";

const socket = new WebSocket(url);

let connectMessageExample: ConnectMessage = {
    type: IncomingMessagesTypes.Connect,
    name: "Player One"
};

let playerId = 0;

let moveMessageExample: MoveMessage = {
    type: IncomingMessagesTypes.Move,
    playerId: playerId,
    move: MoveDirections.RIGHT
};


socket.onopen = () => {
    console.log('connected');

    socket.send(JSON.stringify(connectMessageExample));
};

socket.onerror = function (error) {
    console.error('WebSocket Error ' + error);
};

let moveCounter = 0;


socket.onmessage = (data) => {
    console.log('client data receive ');
    const msg: any = JSON.parse((<string>data.data));
    console.log(msg);

    if(msg.type == ServerResponseTypes.Connected) {
        playerId = (<ConnectResponse>msg).playerId;
    }

    if(msg.type == ServerRequestsTypes.MoveRequest) {

        const randIndex = Math.floor(Math.random() * 10) % MoveDirectionsArray.length;
        moveMessageExample.move = MoveDirectionsArray[randIndex];
        moveMessageExample.playerId = playerId;

        socket.send(JSON.stringify(moveMessageExample));
        moveCounter++;
    }
    if(moveCounter == 30) {
        socket.close();
    }
};