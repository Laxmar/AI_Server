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
    private mapSideInPixel: number = 500;
    private sideLength: number;


    private token: number;
    private socketService: SocketService;


    @ViewChild('map') canvasRef: ElementRef;
    canvasContext: CanvasRenderingContext2D;

    ngOnInit(): void {
        this.canvasContext = this.canvasRef.nativeElement.getContext('2d');
        this.canvasContext.fillStyle = '#ffffff';
        this.canvasContext.fillRect(0, 0, this.mapSideInPixel, this.mapSideInPixel);
        this.testDraw();
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
                    this.sideLength = this.mapSideInPixel / this.map.width;
                    this.drawMap(this.map.width, this.sideLength, this.map.fields);
                }

                if(this.msg.type == "GameStateUpdate") {
                    let gameState = this.msg.gameState;
                    this.drawMap(this.map.width, this.sideLength, this.map.fields);
                    gameState.players.forEach( p => this.drawPlayer(p.x, p.y, this.sideLength, p.id));
                    this.drawFlag(gameState.flag.x, gameState.flag.y, this.sideLength);
                }
            });
    }

    private drawMap(width: number, sideLength: number, fields: number[][]) {
        this.canvasContext.beginPath();
        this.canvasContext.arc(95,50,40,0,2*Math.PI);
        this.canvasContext.stroke();

        for(let y=0; y<width; y++) {
            for(let x=0; x<width; x++) {
                switch (fields[y][x]) {
                    case 1:
                        this.canvasContext.fillStyle = '#52dd32';
                        break;
                    case 2:
                        this.canvasContext.fillStyle = '#254cdd';
                        break;
                    case 3:
                        this.canvasContext.fillStyle = '#aa763f';
                        break;

                }
                this.canvasContext.fillRect(x * sideLength, y * sideLength, sideLength, sideLength);
            }
        }
    }

    private drawPlayer(x: number, y:number, sideLength: number, playerNumber: number) {
        if(playerNumber == 0) {
            this.canvasContext.fillStyle = '#dceb0c';
        } else {
            this.canvasContext.fillStyle = '#eb6e14';
        }

        this.canvasContext.beginPath();
        this.canvasContext.arc(x * sideLength + sideLength/2,y * sideLength + sideLength/2,sideLength/2,0,2*Math.PI);
        this.canvasContext.fill();
    }

    private testDraw() {
        const width = 5;
        this.sideLength = this.mapSideInPixel / width;
        this.drawMap(width, this.sideLength, [ [3,1,1,3,3],[2,3,3,1,3], [2,3,1,3,1], [2,2,1,1,2], [2,2,1,1,2]]);
        this.drawFlag(2,2, this.sideLength);
        this.drawPlayer(0, 0,  this.sideLength , 0);
        this.drawPlayer(4, 4,  this.sideLength , 1);
    }

    drawFlag(xPos, yPos, sideLength) {

        let x = xPos * sideLength + sideLength/2;
        let y = yPos * sideLength;

        this.canvasContext.save();
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(x, y);

        // top left edge
        this.canvasContext.lineTo(x - sideLength / 2, y + sideLength / 2);

        // bottom left edge
        this.canvasContext.lineTo(x, y + sideLength);

        // bottom right edge
        this.canvasContext.lineTo(x + sideLength / 2, y + sideLength / 2);

        // closing the path automatically creates
        // the top right edge
        this.canvasContext.closePath();

        this.canvasContext.fillStyle = '#eb002c';
        this.canvasContext.fill();
    }

    connect() {
        this.socketService.connect();
    }

    restart() {
        const restartMsg = {
            type: "GameRestart",
            token: this.token
        };
        this.socketService.send(restartMsg);
    }


}
