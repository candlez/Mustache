import GameObject from "./GameObject.js";
import TopCornerBounds from "./TopCornerBounds.js"


export default class Square extends GameObject {
    // fields
    #size;

    /**
     * creates a new Square
     * 
     * @param {String} id 
     * @param {Number} xCoord - the left side of the Square
     * @param {Number} yCoord - the top of the Square
     * @param {Number} size - the length of one side
     * @param {*} color 
     */
    constructor(id, xCoord, yCoord, size, color) {
        super(id, xCoord, yCoord);
        this.#size = size;
    }




    getBounds() {
        return new TopCornerBounds(this.getXCoord(), this.getYCoord(), 
            this.#size, this.#size);
    }


    toString() {
        return this.getID();
    }


    // getters and setters
    setSize(newSize) {
        this.#size = newSize;
    }
    getSize() {
        return this.#size;
    }
}