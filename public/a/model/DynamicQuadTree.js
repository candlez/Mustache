import QuadTree from "./QuadTree.js";


/**
 * a QuadTree that supports items moving around within it
 */
export default class DynamicQuadTree extends QuadTree {
    constructor(xCoord, yCoord, width) {
        super(xCoord, yCoord, width);
    }


    /**
     * inserts an item into the tree and tells the item which node it's in
     * 
     * @param {*} item 
     */
    insert(item) {
        var node = this.getNode(item.getBounds());
        node.insert(item);
        item.setNode(node);
    }


    /**
     * makes sure an item is in the right place after its coords have changed
     * 
     * @param {*} item 
     */
    move(item) {
        var curr = item.getNode();
        var bounds = item.getBounds();
        if (curr.getBounds().isBoundsWithinBounds(bounds)) {
            var next = this.getNextNode(bounds, curr);
            if (next != curr) {
                curr.remove(item);
                curr = next;
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
            }
        } else {
            curr.remove(item);
            this.insert(item);
        }
    }
}