import MidPointBounds from "./MidPointBounds.js";


export default class QuadTree {
    // fields
    #root;

    static MAXIMUM_DEPTH = 32;
    
    constructor(xCoord, yCoord, width) {
        this.#root = new QTNode(xCoord, yCoord, width);
    }



    remove(item) {

    }



    queryRange(bounds) {
        
    }


    insert(item) {
        var bounds = item.getBounds();
        var curr = this.#root;
        if (curr.getBounds().isBoundsWithinBounds(bounds)) {
            var counter = 0;
            while (counter < QuadTree.MAXIMUM_DEPTH) {
                var quad1 = curr.getQuadrant(bounds.getLeft(), bounds.getTop());
                var quad2 = curr.getQuadrant(bounds.getRight(), bounds.getBottom());
                if (quad1 != quad2 || quad1 == Quandrants.ON_AXIS) {
                    curr.insert(item);
                    return true;
                } else {
                    if (curr.isLeaf()) {
                        curr.split();
                    }
                    switch (quad1) {
                        case Quandrants.NORTH_WEST:
                            curr = curr.getNorthWest();
                            break;
                        case Quandrants.NORTH_EAST:
                            curr = curr.getNorthEast();
                            break;
                        case Quandrants.SOUTH_EAST:
                            curr = curr.getSouthEast();
                            break;
                        case Quandrants.SOUTH_WEST:
                            curr = curr.getSouthWest();
                            break;
                    }
                    counter++;
                }
            }
            curr.insert(item);            
        }
        throw new Error(item + " is out of bounds!")
        
        /*
        steps:
        1. check if this item should be in the current node
        2. if it should, insert the item into the current node
        3. if it shouldn't, move onto the next node
        */
    }



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


    isEmpty() {
        return this.#objects.length == 0;
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


    insert(item) {
        var index = 0;
        for (index; index < this.#objects.length; index++) {
            if (this.#objects[index].getSize() > item.getSize()) {
                break;
            }
        }
        this.#objects.splice(index, 0, item);
        item.setNode(this);
    }


    split() {
        var half = this.#bounds.getWidth() / 2;
        var quarter = half / 2;

        this.#northWest = new QTNode(this.#xCoord - quarter, this.#yCoord - quarter, half);
        this.#northEast = new QTNode(this.#xCoord + quarter, this.#yCoord - quarter, half);
        this.#southEast = new QTNode(this.#xCoord + quarter, this.#yCoord + quarter, half);
        this.#southWest = new QTNode(this.#xCoord - quarter, this.#yCoord + quarter, half);
    }


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