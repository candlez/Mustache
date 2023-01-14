import {shucker} from '../pages/agario/scripts/shucker.js';

describe('testing for the shucker script', () => {
    var map;
    const funct = shucker;

    beforeEach(() => {
        map = new Map().set("Ahh", {x: 10, y: 20, mass: 200}).set("Ohh", {x: 50, y: 0, mass: 10})
    })

    //-------------------------------------------------------------------------------
    test('test the shucker on the given map', () => {
        var result = funct(map);
        expect(result.keys[0]).toBe("Ahh");
        expect(result.keys[1]).toBe("Ohh");
        expect(result.Ahh.x).toBe(10);
        expect(result.Ahh.y).toBe(20);
        expect(result.Ahh.mass).toBe(200);
        expect(result.Ohh.x).toBe(50);
        expect(result.Ohh.y).toBe(0);
        expect(result.Ohh.mass).toBe(10);
    })
});