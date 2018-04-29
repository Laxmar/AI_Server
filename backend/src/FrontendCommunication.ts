import * as WebSocket from "ws";
import {ConnectMessage} from "./communication/incomingMessages";

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
}