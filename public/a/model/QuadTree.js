import MidPointBounds from "./MidPointBounds.js";


/**
 * a data structure that stores bounds in nodes according to their location
 */
export default class QuadTree {
    // fields
    #root;
    #height;

    static MAXIMUM_DEPTH = 32;
    
    constructor(xCoord, yCoord, width) {
        this.#root = new QTNode(xCoord, yCoord, width);
        this.#height = 1;
    }


    /**
     * @returns whether the tree has reached the maximum allowable depth
     */
    maxDepthReached() {
        return this.#height == QuadTree.MAXIMUM_DEPTH;
    }


    /**
     * @returns the number of levels in the tree
     */
    getHeight() {
        return this.#height;
    }


    remove(item) {

    }


    


    /**
     * @param {Bounds} bounds 
     * @returns a list of every item that intersects the given Bounds
     */
    queryRange(bounds) {
        var items = [];
        var potentialItems = [];

        var path = this.getPath(bounds);
        for (var i = 0; i < path.length; i++) {
            potentialItems = potentialItems.concat(path[i].getObjects());
        }
        var subTrees = this.getSubtrees(path[path.length - 1]);
        for (var i = 0; i < subTrees.length; i++) {
            potentialItems = potentialItems.concat(subTrees[i].getObjects());
        }
        for (var i = 0; i < potentialItems.length; i++) {
            if (bounds.doesBoundsIntersectBounds(potentialItems[i].getBounds())) {
                items.push(potentialItems[i]);
            }
        }
        return items;
    }


    /**
     * inserts an item into the QuadTree
     * 
     * @param {} item 
     */
    insert(item) {
        this.getNode(item.getBounds()).insert(item);
    }


    /**
     * finds the QTNode that the Bounds would be placed in
     * 
     * @param {*} bounds - the Bounds that are being placed
     * @return the QTNode that the Bounds would go in
     */
    getNode(bounds) {
        var path = this.getPath(bounds);
        return path[path.length - 1];
    }


    /**
     * @param {Bounds} bounds 
     * @returns a list of every node from the root up to and including the node 
     * that this bounds goes in
     */
    getPath(bounds) {
        var path = [];
        var curr = this.#root;
        if (curr.getBounds().isBoundsWithinBounds(bounds)) {
            while (!this.maxDepthReached()) {
                path.push(curr);
                var next = this.getNextNode(bounds, curr);
                if (next == curr) {
                    break;
                }
                else {
                    curr = next;
                }
            }
            return path;          
        }
        throw new Error(item + " is out of bounds!");
    }


    /** 
     * @param {QTNode} node - the root node to all the subtrees being
     *                        collected from
     * @returns a list of every item lowers than this node in the tree
     */
    getSubtrees(node) {
        var nodes = [];
        if (!node.isLeaf()) {
            nodes.push(node.getNorthWest());
            nodes = nodes.concat(this.getSubtrees(node.getNorthWest()));
            nodes.push(node.getNorthEast());
            nodes = nodes.concat(this.getSubtrees(node.getNorthEast()));
            nodes.push(node.getSouthEast());
            nodes = nodes.concat(this.getSubtrees(node.getSouthEast()));
            nodes.push(node.getSouthWest());
            nodes = nodes.concat(this.getSubtrees(node.getSouthWest()));
        }
        return nodes;
    }


    /**
     * takes a Bounds and a node and finds out where it should be sorted
     * 
     * @param {Bounds} bounds
     * @param {QTNode} curr - the node the Bounds are currently at 
     * @returns the node that the Bounds should go in
     */
    getNextNode(bounds, curr) {
        var quad1 = curr.getQuadrant(bounds.getLeft(), bounds.getTop());
        var quad2 = curr.getQuadrant(bounds.getRight(), bounds.getBottom());
        if (quad1 != quad2 || quad1 == Quandrants.ON_AXIS) {
            return curr;
        } else {
            if (curr.isLeaf()) {
                curr.split();
                this.#height++;
            }
            switch (quad1) {
                case Quandrants.NORTH_WEST:
                    return curr.getNorthWest();
                case Quandrants.NORTH_EAST:
                   return curr.getNorthEast();
                case Quandrants.SOUTH_EAST:
                    return curr.getSouthEast();
                case Quandrants.SOUTH_WEST:
                    return curr.getSouthWest();
            }
        }
    }



    /**
     * converts the QuadTree into a readable String format
     * 
     * @returns the QuadTree as a String
     */
    toString() {
        return this.#root.toString();
    }
}

//-------------------------------------------------------------------------------------------------------
class QTNode {
    // fields
    #xCoord;
    #yCoord;
    #bounds

    #northWest;
    #northEast;
    #southEast;
    #southWest;

    #objects;


    constructor(xCoord, yCoord, width) {
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
        this.#bounds = new MidPointBounds(xCoord, yCoord, width, width);

        this.#objects = [];

        this.#northWest = null;
        this.#northEast = null;
        this.#southEast = null;
        this.#southWest = null;
    }


    /**
     * checks whether a Node is a leaf
     * 
     * @returns whether this Node is a leaf
     */
    isLeaf() {
        return this.#northWest == null;
    }


    /**
     * @returns whether the node has no items in it
     */
    isEmpty() {
        return this.#objects.length == 0;
    }


    /**
     * removes an item from the node while keeping sorted order
     * 
     * @param {*} item 
     */
    remove(item) {
        var index = -1;
        for (var i = 0; i < this.#objects.length; i++) {
            if (this.#objects[i] == item) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            new Error('attempted to remove: ' + item.toString() + '; item not found')
        } else {
            this.#objects.splice(index, 1);
        }
    }



    /**
     * turns this Node into a leaf
     */
    leafify() {
        this.#northWest = null;
        this.#northEast = null;
        this.#southEast = null;
        this.#southWest = null;
    }


    /**
     * checks which Quadrant a point is in within the bounds
     * 
     * @param {Number} xCoord - the x coordinate of the point
     * @param {Number} yCoord - the y coordinate of the point
     * @returns - the Quandrant that the point falls in
     */
    getQuadrant(xCoord, yCoord) {
        if (xCoord < this.#xCoord) {
            if (yCoord < this.#yCoord) {
                return Quandrants.NORTH_WEST;
            } else if (yCoord > this.#yCoord) {
                return Quandrants.SOUTH_WEST;
            }
        } else if (xCoord > this.#xCoord) {
            if (yCoord < this.#yCoord) {
                return Quandrants.NORTH_EAST;
            } else if (yCoord > this.#yCoord) {
                return Quandrants.SOUTH_EAST;
            }
        }
        return Quandrants.ON_AXIS;
    }


    /**
     * inserts an item into the node, maintaining ascending size order
     * 
     * @param {*} item 
     */
    insert(item) {
        var index = 0;
        for (index; index < this.#objects.length; index++) {
            if (this.#objects[index].getSize() > item.getSize()) {
                break;
            }
        }
        this.#objects.splice(index, 0, item);
        item.setNode(this); // huh??? I thought this was just in Dynamic
    }


    /**
     * creates 4 children for this node
     */
    split() {
        var half = this.#bounds.getWidth() / 2;
        var quarter = half / 2;

        this.#northWest = new QTNode(this.#xCoord - quarter, this.#yCoord - quarter, half);
        this.#northEast = new QTNode(this.#xCoord + quarter, this.#yCoord - quarter, half);
        this.#southEast = new QTNode(this.#xCoord + quarter, this.#yCoord + quarter, half);
        this.#southWest = new QTNode(this.#xCoord - quarter, this.#yCoord + quarter, half);
    }


    /**
     * @returns a string version of this node and all its children
     */
    toString() {
        var str = "(" + this.#objects;
        if (!this.isLeaf()) {
            str += "{" + this.#northWest.toString();
            str += this.#northEast.toString();
            str += this.#southEast.toString();
            str += this.#southWest.toString() + "}";
        }
        return str + ")";
    }



    // getters and setters
    getBounds() {
        return this.#bounds;
    }
    getObjects() {
        return this.#objects;
    }
    getXCoord() {
        return this.#xCoord;
    }
    getYCoord() {
        return this.#yCoord;
    }
    setNorthWest(newNW) { // do we need setters?
        this.#northEast = newNW;
    }
    getNorthWest() {
        return this.#northWest;
    }
    setNorthEast(newNE) {
        this.#northEast = newNE;
    }
    getNorthEast() {
        return this.#northEast;
    }
    setSouthEast(newSE) {
        this.#southEast = newSE;
    }
    getSouthEast() {
        return this.#southEast
    }
    setSouthWest(newSW) {
        this.#southWest = newSW;
    }
    getSouthWest() {
        return this.#southWest;
    }
}


class Quandrants {
    static ON_AXIS = 0;
    static NORTH_WEST = 1;
    static NORTH_EAST = 2;
    static SOUTH_EAST = 3;
    static SOUTH_WEST = 4;
}