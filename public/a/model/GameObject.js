
export default class GameObject {
    // fields
    #id;
    #xCoord;
    #yCoord;
    #animations;

    constructor(id, xCoord, yCoord) {
        this.#id = id;
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
    }

    // methods


    // getters and setters
    getID() {
        return this.#id;
    }
    setXCoord(newX) {
        this.#xCoord = newX;
    }
    getXCoord() {
        return this.#xCoord;
    }
    setYCoord(newY) {
        this.#yCoord = newY;
    }
    getYCoord() {
        return this.#yCoord;
    }
}