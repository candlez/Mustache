import Interpolator from "../model/Interpolator.js";

describe("unit testing for the Interpolator class", () => {
    var interpolator;

    beforeEach(() => {
        var game = {
            getPlayer() {
                return {
                    getID() {
                        return "John"
                    }
                }
            }
        }
        interpolator = new Interpolator(game);
    });

    test("testing unloadChanges", () => {
        var batch = {
            array: [
                {id: "a", code: 1, data: 4, timeStamp: 10},
                {id: "a", code: 1, data: 4, timeStamp: 15},
                {id: "a", code: 1, data: 4, timeStamp: 16},
                {id: "a", code: 1, data: 4, timeStamp: 20},
                {id: "a", code: 1, data: 4, timeStamp: 25},
            ]
        };
        interpolator.loadBatch(batch);
        expect(interpolator.size()).toBe(5);

        interpolator.unloadChanges(30);
        expect(interpolator.size()).toBe(0);

        interpolator.loadBatch(batch);
        interpolator.unloadChanges(20);
        expect(interpolator.size()).toBe(1);

        interpolator.unloadChanges(24);
        expect(interpolator.size()).toBe(1);

        interpolator.unloadChanges(500);
        expect(interpolator.size()).toBe(0);
    });
});