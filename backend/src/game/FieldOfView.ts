import {Point} from "./Point";

export default class FieldOfView {

    private centerPoint: Point;
    private viewRange: number;

    private upBoundary: number;
    private downBoundary: number;
    private leftBoundary: number;
    private rightBoundary: number;

    constructor(centerPoint: Point, viewRange: number) {
        this.centerPoint = centerPoint;
        this.viewRange = viewRange;
        this.upBoundary = this.centerPoint.y + this.viewRange;
        this.downBoundary = this.centerPoint.y - this.viewRange;
        this.leftBoundary = this.centerPoint.x - this.viewRange;
        this.rightBoundary = this.centerPoint.x + this.viewRange;
    }

    public isPointVisible(point: Point) {
        return point.y <= this.upBoundary && point.y >= this.downBoundary && point.x <= this.rightBoundary && point.x >= this.leftBoundary;
    }

}