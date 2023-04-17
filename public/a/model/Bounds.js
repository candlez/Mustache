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

    setUp(xCoord, yCoord, width, height) {
        throw new Error("you must implement this method")
    }


    /**
     * checks whether a point is within this Bounds
     * 
     * @param {Number} xCoord - the x coordinate of the point being checked
     * @param {Number} yCoord - the y coordinate of the point being checked
     * @returns whether the point is inside this Bounds
     */
    isPointWithinBounds(xCoord, yCoord) { // or equal to?
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
}