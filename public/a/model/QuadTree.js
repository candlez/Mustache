

export default class QuadTree {
    // fields
    #root;

    
    constructor(xCoord, yCoord, half) {
        this.#root = new QTNode(xCoord, yCoord, half); // node?
    }






    queryRange(bounds) {
        
    }


    insert(item) {
        this.#root.insert(item);
    }
}


class QTNode {
    // fields
    #xCoord;
    #yCoord;
    #half;

    #northWest;
    #northEast;
    #southEast;
    #southWest;

    #objects;


    constructor(xCoord, yCoord, half) {
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
        this.#half = half;
        this.#objects = [];

        this.#northWest = null;
        this.#northEast = null;
        this.#southEast = null;
        this.#southWest = null;
    }

    isLeaf() {
        return this.#northWest = null;
    }

    /**
     * turns this node into a leaf
     */
    leafify() {
        this.#northWest = null;
        this.#northEast = null;
        this.#southEast = null;
        this.#southWest = null;
    }


    insert(item) {
        itemBounds = item.getBounds();
        
    }


    split() {
        newHalf = this.#half / 2;
        this.#northWest = new QTNode(this.#xCoord - newHalf, this.#yCoord - newHalf, newHalf);
        this.#northEast = new QTNode(this.#xCoord + newHalf, this.#yCoord - newHalf, newHalf);
        this.#southEast = new QTNode(this.#xCoord + newHalf, this.#yCoord + newHalf, newHalf);
        this.#southWest = new QTNode(this.#xCoord - newHalf, this.#yCoord + newHalf, newHalf);

    }


    getBounds() {

    }

    // getters and setters
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