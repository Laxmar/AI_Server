import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'app';

    @ViewChild('myCanvas') canvasRef: ElementRef;

    ngOnInit(): void {
        let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

        ctx.fillStyle = '#ddd409';
        ctx.fillRect(0, 0, 500, 500);

    }
}
