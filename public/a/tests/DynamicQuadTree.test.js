import DynamicQuadTree from "../model/DynamicQuadTree.js";
import Square from "../model/Square.js";


describe('unit testing for DynamicQuadTree', () => {
    var tree;

    beforeEach(() => {
        tree = new DynamicQuadTree(200, 200, 400);
    })

    test('testing move', () => {
        var s1 = new Square("1", 175, 175, 50, "");
        tree.insert(s1);
        expect(tree.getHeight()).toBe(1)
        s1.setXCoord(75);
        s1.setYCoord(75);
        tree.move(s1);
        expect(tree.getHeight()).toBe(2);
        expect(tree.toString()).toBe("({(1)()()()})");

        s1.setXCoord(175);
        tree.move(s1);
        expect(tree.toString()).toBe("(1{()()()()})");

        s1.setXCoord(350);
        s1.setYCoord(350);
        tree.move(s1);
        expect(tree.getHeight()).toBe(3);
        expect(tree.toString()).toBe("({()()({()()(1)()})()})");

        s1.setXCoord(0);
        tree.move(s1);
        expect(tree.toString()).toBe("({()()({()()()()})({()()()(1)})})");
    })
})