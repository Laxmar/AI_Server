import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "./services/socket.service";
import {FrontConnectResponse, ServerResponseTypes} from "../../../backend/src/communication/serverResponses";
import GameMap from "../../../backend/src/game/GameMap";
import {GameMapDto} from "../../../backend/src/common/GameMapDto";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [SocketService],
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    msg: any;

    map: GameMapDto;

    private socketService: SocketService;


    // @ViewChild('myCanvas') canvasRef: ElementRef;

    ngOnInit(): void {
        // let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
        // ctx.fillStyle = '#ddd409';
        // ctx.fillRect(0, 0, 500, 500);
    }

    constructor(socketService: SocketService) {
        this.socketService = socketService;
        this.socketService.initSocket();

        this.socketService.onMessage()
            .subscribe((message: any) => {
                console.log("msg");
                this.msg = JSON.parse(message.data);

                if(this.msg.type == ServerResponseTypes.FrontConnect) {
                    this.map = (<FrontConnectResponse>this.msg).map;
                    console.log()
                }
            });
    }

    connect() {
        this.socketService.connect();
    }
}
