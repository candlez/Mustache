import QuadTree from "./QuadTree.js";


export default class DynamicQuadTree extends QuadTree {
    constructor(xCoord, yCoord, width) {
        super(xCoord, yCoord, width);
    }


    insert(item) {
        var node = this.getNode(item);
        node.insert(item);
        item.setNode(node);
    }
}