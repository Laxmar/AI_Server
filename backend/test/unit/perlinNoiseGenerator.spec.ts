import { assert, expect } from "chai";
import * as mocha from "mocha";

import GameMap from "../../src/game/GameMap";
import {Point} from "../../src/game/Point";
import FieldOfView from "../../src/game/FieldOfView";
import { PerlinNoiseGenerator } from "../../src/game/PerlinNoiseGenerator";


describe("PerlinNoise ", () => {

    describe("Generate", () => {

        it("OK", () => {
            const size = 10;

            const generator: PerlinNoiseGenerator = new PerlinNoiseGenerator(size, size);
            // console.log(generator.noise);
            console.log(generator.generatePerlinNoise(8));

        });





    })
});