import Animation from "./Animation.js";

export default class MoveableAnimation extends Animation {
    // fields
    #xCoord;
    #yCoord;

    constructor(xCoord, yCoord) {
        super();
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
    }

    // getter and setters
    setXCoord(newXCoord) {
        this.#xCoord = newXCoord;
    }
    getXCoord() {
        return this.#xCoord;
    }
    setYCoord(newYCoord) {
        this.#yCoord = newYCoord;
    }
    getYCoord() {
        return this.#yCoord;
    }

    // methods
    move(xChange, yChange) {
        this.#xCoord = this.#xCoord + xChange;
        this.#yCoord = this.#yCoord + yChange;
    }
}