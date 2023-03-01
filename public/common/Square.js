import SquareAnimation from "./SquareAnimation.js";


export default class Square {
    // fields
    #xCoord;
    #yCoord;
    #size;

    #animation;

    constructor(xCoord, yCoord, size) {
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
        this.#size = size;

        this.#animation = new SquareAnimation(this);
    }

    // methods
    move(xChange, yChange) {
        this.#xCoord = this.#xCoord + xChange;
        this.#yCoord = this.#yCoord + yChange;
    }

    // getters and setters
    getXCoord() {
        return this.#xCoord;
    }
    getYCoord() {
        return this.#yCoord;
    }
    getSize() {
        return this.#size;
    }
    getAnimation() {
        return this.#animation;
    }
}