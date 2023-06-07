import QuadTree from "../model/QuadTree.js";
import Square from "../model/Square.js";
import TopCornerBounds from "../model/TopCornerBounds.js";


describe('unit testing for QuadTree', () => {
    var tree;

    beforeEach(() => {
        tree = new QuadTree(128, 128, 256);
    })

    test('little test', () => {
        var testArr = [];
        testArr.splice(0, 0, 1);
        expect(testArr[0]).toBe(1);
        
        testArr.splice(1, 0, 4);
        expect(testArr[1]).toBe(4);
    })


    test('testing insert on items that cant be moved lower', () => {
        tree.insert(new Square("1", 64, 64, 128, ""));
        expect(tree.toString()).toBe("(1)");

        tree.insert(new Square("2", 128, 128, 16, ""));
        expect(tree.toString()).toBe("(2,1)");

        tree.insert(new Square("3", 100, 100, 28, ""));
        expect(tree.toString()).toBe("(2,3,1)");

        tree.insert(new Square("4", 110, 128, 12, ""));
        expect(tree.toString()).toBe("(4,2,3,1)");

        tree.insert(new Square("5", 30, 30, 200, ""));
        expect(tree.toString()).toBe("(4,2,3,1,5)");
    })


    test('testing insert for items that need to go lower', () => {
        tree.insert(new Square("1", 60, 60, 10, ""));
        expect(tree.toString()).toBe("({(1)()()()})");

        tree.insert(new Square("2", 100, 100, 50, ""));
        expect(tree.toString()).toBe("(2{(1)()()()})");

        tree.insert(new Square("3", 150, 50, 50, ""));
        expect(tree.toString()).toBe("(2{(1)(3)()()})");

        tree.insert(new Square("4", 90, 90, 10, ""));
        expect(tree.toString()).toBe("(2{(1{()()(4)()})(3)()()})");
    })


    test('testing queryRange', () => {
        tree.insert(new Square("1", 40, 100, 80, ""));
        tree.insert(new Square("2", 210, 20, 15, ""));
        tree.insert(new Square("3", 140, 120, 25, ""));
        tree.insert(new Square("4", 130, 215, 10, ""));
        tree.insert(new Square("5", 180, 160, 50, ""));
        tree.insert(new Square("6", 100, 180, 10, ""));
        tree.insert(new Square("7", 65, 190, 3, ""));
        tree.insert(new Square("8", 90, 215, 15, ""));
        tree.insert(new Square("9", 150, 20, 12, ""));
        tree.insert(new Square("10", 20, 15, 5, ""));
        tree.insert(new Square("11", 75, 25, 30, ""));
        tree.insert(new Square("12", 10, 225, 20, ""));

        expect(tree.queryRange(new TopCornerBounds(100, 50, 150, 170)).length)
            .toBe(7);
        expect(tree.queryRange(new TopCornerBounds(50, 140, 65, 95)).length)
            .toBe(4);
        expect(tree.queryRange(new TopCornerBounds(128, -30, 128, 60)).length)
            .toBe(2);
    })


    test('testing adjustBoundsToFit', () => {
        var b1 = tree.adjustBoundsToFit(new TopCornerBounds(-20, -20, 50, 60));
        expect(b1.getTop()).toBe(0);
        expect(b1.getLeft()).toBe(0);
        expect(b1.getRight()).toBe(30);
        expect(b1.getBottom()).toBe(40);
        expect(b1.getWidth()).toBe(30);
        expect(b1.getHeight()).toBe(40);

        b1 = tree.adjustBoundsToFit(new TopCornerBounds(200, 196, 100, 150));
        expect(b1.getTop()).toBe(196);
        expect(b1.getLeft()).toBe(200);
        expect(b1.getRight()).toBe(256);
        expect(b1.getBottom()).toBe(256);
        expect(b1.getWidth()).toBe(56);
        expect(b1.getHeight()).toBe(60);

        b1 = tree.adjustBoundsToFit(new TopCornerBounds(-20, -20, 3000, 3000));
        expect(b1.getTop()).toBe(0);
        expect(b1.getLeft()).toBe(0);
        expect(b1.getRight()).toBe(256);
        expect(b1.getBottom()).toBe(256);
        expect(b1.getWidth()).toBe(256);
        expect(b1.getHeight()).toBe(256);

        b1 = tree.adjustBoundsToFit(new TopCornerBounds(100, -20, 50, 3000));
        expect(b1.getTop()).toBe(0);
        expect(b1.getLeft()).toBe(100);
        expect(b1.getRight()).toBe(150);
        expect(b1.getBottom()).toBe(256);
        expect(b1.getWidth()).toBe(50);
        expect(b1.getHeight()).toBe(256);

        b1 = tree.adjustBoundsToFit(new TopCornerBounds(-30, 200, 150, 100));
        expect(b1.getTop()).toBe(200);
        expect(b1.getLeft()).toBe(0);
        expect(b1.getRight()).toBe(120);
        expect(b1.getBottom()).toBe(256);
        expect(b1.getWidth()).toBe(120);
        expect(b1.getHeight()).toBe(56);
    })
})