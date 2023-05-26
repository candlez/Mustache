import Bounds from "../model/Bounds.js";
import TopCornerBounds from "../model/TopCornerBounds.js";
import MidPointBounds from "../model/MidPointBounds.js";


describe('unit testing for Bounds and its subclasses', () => {
    var midPoint;
    var topCorner;

    beforeEach(() => {
        midPoint = new MidPointBounds(128, 128, 256, 256);
        topCorner = new TopCornerBounds(0, 0, 256, 256);
    })

    test('testing the constructors', () => {
        expect(midPoint.getTop()).toBe(0);
        expect(midPoint.getLeft()).toBe(0);
        expect(midPoint.getBottom()).toBe(256);
        expect(midPoint.getRight()).toBe(256);
        expect(midPoint.getWidth()).toBe(256);

        expect(topCorner.getTop()).toBe(0);
        expect(topCorner.getLeft()).toBe(0);
        expect(topCorner.getBottom()).toBe(256);
        expect(topCorner.getRight()).toBe(256);
        expect(topCorner.getWidth()).toBe(256);
    })

    test('testing isPointWithinBounds()', () => {
        expect(midPoint.isPointWithinBounds(30, 30)).toBe(true);
        expect(midPoint.isPointWithinBounds(-30, -30)).toBe(false);
        expect(topCorner.isPointWithinBounds(300, -30)).toBe(false);
        expect(topCorner.isPointWithinBounds(50, -30)).toBe(false);
        expect(midPoint.isPointWithinBounds(50, 300)).toBe(false);
    })


    test('testing Bounds intersection', () => {
        expect(midPoint.doesBoundsIntersectBounds(new TopCornerBounds(300, 300, 20, 30))).toBe(false);
        expect(midPoint.doesBoundsIntersectBounds(new TopCornerBounds(-10, -10, 20, 30))).toBe(true);
        expect(midPoint.doesBoundsIntersectBounds(new TopCornerBounds(-20, 246, 20, 30))).toBe(true);
        expect(midPoint.doesBoundsIntersectBounds(new TopCornerBounds(200, -20, 100, 30))).toBe(true);
        expect(midPoint.doesBoundsIntersectBounds(new TopCornerBounds(100, 100, 1000, 3000))).toBe(true);
        expect(midPoint.doesBoundsIntersectBounds(new TopCornerBounds(20, 230, 100, 100))).toBe(true);
        expect(midPoint.doesBoundsIntersectBounds(new TopCornerBounds(-30, -30, 300, 300))).toBe(true);
    })
})