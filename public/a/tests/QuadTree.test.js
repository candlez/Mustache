import QuadTree from "../model/QuadTree.js";
import Square from "../model/Square.js";


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


    test('testing that an error is thrown when out of bounds', () => {
        expect(() => {tree.insert(new Square("1", 30, 30, 256, ""))}).toThrow();
        expect(() => {tree.insert(new Square("2", 250, 250, 6, ""))}).not.toThrow();
    })
})