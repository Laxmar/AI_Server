import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
// import * as WebSocket from "ws";

@Injectable()
export class SocketService {

    private socket: WebSocket;
    private serverUrl: string = "ws://localhost:8000";

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

    public send() {
        this.socket.send("cos");
    }

}
