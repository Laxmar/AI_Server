export default class GameMap {
    readonly width: number;
    readonly height: number;

    map: number[][] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.generateMap();
    }

    private generateMap() {
        for(let i = 0; i<this.height; i++) {
            this.map.push([]);
            for(let j=0; j<this.width; j++) {
                this.map[i].push(1);
            }
        }
    }
}

// send whole gameMap
// -1 when bot cannot see field