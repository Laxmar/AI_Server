import {Point} from "./Point";
import FieldOfView from "./FieldOfView";
import {PerlinNoiseGenerator} from "./PerlinNoiseGenerator";
import {GroundTypes} from "./enums";

export default class GameMap {
    readonly width: number;
    readonly height: number;

    map: number[][] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.generateMap();
    }

    public calculateMapCenter(): Point {
        return new Point(this.width/2, this.height/2);
    }

    public calculateVisibleMap(fieldOfView: FieldOfView): number[][] {
        let visibleMap: number[][] = Object.assign([], this.map);
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
        this.map = perlinNoiseGenerator.generatePerlinNoise(5);

        for(let i = 0; i<this.height; i++) {
            for(let j=0; j<this.width; j++) {
                this.map[i][j] = this.convertGroundType(this.map[i][j])
            }
        }

    }

    private convertGroundType(field: number): number {
        if (field <= 0.5) {
            return GroundTypes.GRASS;
        }
        if (field > 0.5 && field < 0.75) {
           return GroundTypes.WATER;
        }
        if (field > 0.75) {
            return GroundTypes.SWAMP;
        }
    }

}
