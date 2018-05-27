import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "./services/socket.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [SocketService],
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    msg: any;

    map: any;

    private token: number;
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

                if(this.msg.type == "FrontConnect") {
                    this.map = this.msg.map;
                    this.token = this.msg.token;
                    console.log()
                }
            });
    }

    connect() {
        this.socketService.connect();
    }

    restart() {
        const restartMsg = {
            type: "GameRestart",
            token: this.token
        }
        this.socketService.send(restartMsg);
    }

}
