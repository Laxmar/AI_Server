import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

@Injectable()
export class SocketService {

    private socket: WebSocket;

    // TODO move constants to config
    private readonly serverUrl: string = "ws://localhost:8000";
    private readonly frontClientName = "FrontClient";

    constructor() {
    }

    public initSocket(): void {
        this.socket = new WebSocket(this.serverUrl);

    }

    public onMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.onmessage = (data: any) => {
                observer.next(data);
            }
        });
    }

    public connect() {
        if(this.socket.readyState !== WebSocket.OPEN) {
            this.initSocket();
        }
        const connectMsg =
            {
                type: "Connect",
                name: this.frontClientName
            };
        this.socket.send(JSON.stringify(connectMsg));
    }

    public send(msg: Object) {
        if(this.socket.readyState) {
            this.socket.send(JSON.stringify(msg));
        }
    }

}
