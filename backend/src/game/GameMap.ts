import {Point} from "./Point";
import FieldOfView from "./FieldOfView";

export default class GameMap {
    readonly width: number;
    readonly height: number;

    readonly map: number[][] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.generateMap();
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

    // TODO generateMap with perlin noise alg
    private generateMap() {
        for(let i = 0; i<this.height; i++) {
            this.map.push([]);
            for(let j=0; j<this.width; j++) {
                this.map[i].push(1);
            }
        }
    }



}
