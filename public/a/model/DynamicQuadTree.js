import QuadTree from "./QuadTree.js";


export default class DynamicQuadTree extends QuadTree {
    constructor(xCoord, yCoord, width) {
        super(xCoord, yCoord, width);
    }


    insert(item) {
        var node = this.getNode(item.getBounds());
        node.insert(item);
        item.setNode(node);
    }



    move(item) {
        var curr = item.getNode();
        curr.remove(item);
        var bounds = item.getBounds();
        if (curr.getBounds().isBoundsWithinBounds(bounds)) {
            while (!this.maxDepthReached()) {
                var next = this.getNextNode(bounds, curr);
                if (next == curr) {
                    break;
                }
                else {
                    curr = next;
                }
            }
            curr.insert(item);
            item.setNode(curr);
        } else {
            this.insert(item);
        }
    }
}