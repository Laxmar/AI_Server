export default class GameMap {
    readonly width: number;
    readonly height: number;

    map: number[][] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.generateMap();
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
