import * as WebSocket from "ws";

const url = "ws://localhost:8000";

const socket = new WebSocket(url);

socket.onopen = () => {
    console.log('connected');
    // socket.send(Date.now(), () => {
    //     console.log('data sent');
    //     socket.close();
    // });

};

socket.onerror = function (error) {
    console.error('WebSocket Error ' + error);
};


socket.onmessage = (data) => {
    console.log('client data receive ' + data);
};