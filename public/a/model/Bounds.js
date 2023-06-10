/**
 * a rectangle for the purpose of representing areas
 */
export default class Bounds {
    // fields
    #top;
    #left;
    #width;
    #height;


    constructor(xCoord, yCoord, width, height) {
        var bounds = this.setUp(xCoord, yCoord, width, height);
        this.#top = bounds.top;
        this.#left = bounds.left;
        this.#width = bounds.width;
        this.#height = bounds.height;
    }

    setUp(xCoord, yCoord, width, height) { // this is stupid and it's going to be fixed
        throw new Error("you must implement this method")
    }


    /**
     * checks whether a point is within this Bounds
     * 
     * @param {Number} xCoord - the x coordinate of the point being checked
     * @param {Number} yCoord - the y coordinate of the point being checked
     * @returns whether the point is inside this Bounds
     */
    isPointWithinBounds(xCoord, yCoord) {
        return xCoord >= this.#left && xCoord <= this.getRight() && 
            yCoord >= this.#top && yCoord <= this.getBottom();
    }


    /**
     * checks whether another Bounds object is contained entirely within this one
     * 
     * @param {Bounds} bounds - the other bounds object
     * @returns whether the other bounds object is entirely within this one
     */
    isBoundsWithinBounds(bounds) {
        return this.isPointWithinBounds(bounds.getLeft(), bounds.getTop()) &&
            this.isPointWithinBounds(bounds.getRight(), bounds.getBottom());
    }


    /**
     * checks to see if another Bounds intersects this Bounds
     * two bounds are considered intersecting if they overlap at all
     * 
     * @param {Bounds} bounds - the other Bounds
     * @returns whether the two Bounds intersect
     */
    doesBoundsIntersectBounds(bounds) {
        if (this.#left > bounds.getRight() || bounds.getLeft() > this.getRight()) {
            return false;
        }
        if (this.#top > bounds.getBottom() || bounds.getTop() > this.getBottom()) {
            return false;
        }
        return true;
    }


    /**
     * @param {Bounds} bounds 
     * @returns whether two Bounds are equivalent
     */
    equals(bounds) {
        return this.getTop() == bounds.getTop() && this.getLeft() == bounds.getLeft() &&
            this.getBottom() == bounds.getBottome() && this.getRight() == bounds.getRight();
    }


    /**
     * @returns the Bounds as a String
     */
    toString() {
        var str = "left: " + this.getLeft();
        str += ", top: " + this.getTop();
        str += ", right: " + this.getRight();
        str += ", bottom: " + this.getBottom();
        return str;
    }


    // getters
    getTop() {
        return this.#top;
    }
    getLeft() {
        return this.#left;
    }
    getBottom() {
        return this.#top + this.#height;
    }
    getRight() {
        return this.#left + this.#width;
    }
    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }
    getCenterX() {
        return this.#left + (this.#width * .5);
    }
    getCenterY() {
        return this.#top + (this.#height * .5);
    }
}