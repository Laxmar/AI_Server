import { assert, expect } from "chai";
import * as mocha from "mocha";

import GameMap from "../../src/game/GameMap";
import {Point} from "../../src/game/Point";
import FieldOfView from "../../src/game/FieldOfView";


describe("GameMap", () => {


    it("Should generate map", () => {
        const testMap: GameMap = new GameMap(10, 10);

        console.log(testMap.fields);
    });

    describe("Calculate visible fields", () => {


        it("Should return correctly masked fields for correct point", () => {
            const testMap: GameMap = new GameMap(5, 5);
            const centerPoint: Point = new Point(2,2);
            const viewRange: number = 1;
            const fieldOfView: FieldOfView = new FieldOfView(centerPoint, viewRange);

            let result: number[][] = testMap.calculateVisibleMap(fieldOfView);

            const expectedResult =
                [ [ -1, -1, -1, -1, -1 ],
                [ -1, 1, 1, 1, -1 ],
                [ -1, 1, 1, 1, -1 ],
                [ -1, 1, 1, 1, -1 ],
                [ -1, -1, -1, -1, -1 ] ];

            assert.isArray(result);
            assert.deepEqual(result, expectedResult);

        });

        it("Should return fully masked fields for point out of the fields", () => {
            const testMap: GameMap = new GameMap(2, 2);
            const centerPoint: Point = new Point(10,10);
            const viewRange: number = 1;
            const fieldOfView: FieldOfView = new FieldOfView(centerPoint, viewRange);

            let result: number[][] = testMap.calculateVisibleMap(fieldOfView);

            const expectedResult = [ [-1, -1], [-1, -1]];

            assert.isArray(result);
            assert.deepEqual(result, expectedResult);

        });


    })
});