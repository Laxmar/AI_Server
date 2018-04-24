import * as WebSocket from "ws";
import {ConnectMessage, IncomingMessagesTypes, IncomingMessage, MoveMessage} from "../communication/incomingMessages";
import {MoveDirections, MoveDirectionsArray} from "../game/enums";
import {ServerRequestsTypes} from "../communication/serverRequests";

const url = "ws://localhost:8000";

const socket = new WebSocket(url);

const connectMessageExample: ConnectMessage = {
    type: IncomingMessagesTypes.Connect,
    name: "Player One"
};

let moveMessageExample: MoveMessage = {
    type: IncomingMessagesTypes.Move,
    playerId: 0,
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


    if(msg.type == ServerRequestsTypes.MoveRequest) {

        const randIndex = Math.floor(Math.random() * 10) % MoveDirectionsArray.length;
        moveMessageExample.move = MoveDirectionsArray[randIndex];

        socket.send(JSON.stringify(moveMessageExample));
        moveCounter++;
    }
    if(moveCounter == 30) {
        socket.close();
    }
};