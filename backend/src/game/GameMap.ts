import {Point} from "./Point";
import FieldOfView from "./FieldOfView";
import {PerlinNoiseGenerator} from "./PerlinNoiseGenerator";
import {GroundTypes} from "./enums";
import {GameMapDto} from "../common/GameMapDto";

export default class GameMap {
    readonly width: number;
    readonly height: number;
    fields: number[][] = [];

    private readonly waterThreshold = 0.5;
    private readonly swampThreshold = 0.75;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.generateMap();
    }

    public getMapDto(): GameMapDto {
        return {
            width: this.width,
            height: this.height,
            fields: this.fields
        }
    }

    public calculateMapCenter(): Point {
        return new Point(Math.floor(this.width/2), Math.floor(this.height/2));
    }

    public calculateVisibleMap(fieldOfView: FieldOfView): number[][] {
        let visibleMap: number[][] = Object.assign([], this.fields);
        const fieldNotVisible: number = -1;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (fieldOfView.isPointVisible( new Point(x,y) )) {
                    continue;
                }
                visibleMap[y][x] = fieldNotVisible;
            }
        }
        return visibleMap;
    }

    private generateMap() {
        const perlinNoiseGenerator = new PerlinNoiseGenerator(this.width, this.height);
        this.fields = perlinNoiseGenerator.generatePerlinNoise(5);

        for(let i = 0; i<this.height; i++) {
            for(let j=0; j<this.width; j++) {
                this.fields[i][j] = this.convertGroundType(this.fields[i][j])
            }
        }

    }

    private convertGroundType(field: number): number {
        if (field <= this.waterThreshold) {
            return GroundTypes.GRASS;
        }
        if (field > this.waterThreshold && field < this.swampThreshold) {
           return GroundTypes.WATER;
        }
        if (field > this.swampThreshold) {
            return GroundTypes.SWAMP;
        }
    }

}
