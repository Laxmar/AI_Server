import FieldOfView from "../../src/game/FieldOfView";
import {Point} from "../../src/game/Point";
import {expect} from "chai";


describe("FieldOfView", () => {

    describe("isPointVisible  ", () => {

        it("should return true ", () => {
            const centerPoint = new Point(5,5);
            const viewRange = 2;
            const filedOfView = new FieldOfView(centerPoint, viewRange);
            const point = new Point(5,6);

            const result = filedOfView.isPointVisible(point);
            expect(result).to.be.true;
        });

        it("should return false ", () => {
            const centerPoint = new Point(2,2);
            const viewRange = 2;
            const filedOfView = new FieldOfView(centerPoint, viewRange);
            const point = new Point(5,5);

            const result = filedOfView.isPointVisible(point);
            expect(result).to.be.false;
        })


    });

});