
export default class GameObject {
    // fields
    #id;
    #xCoord;
    #yCoord;
    #vectors;
    #animations;
    #speed;
    #node;

    constructor(id, xCoord, yCoord) {
        this.#id = id;
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
        this.#vectors = [0, 0];
        this.#animations = [];
        this.#node = null;
    }

    // methods
    drawFrame(ctx, scale, player, display) {
        for (var i = 0; i < this.#animations.length; i++) {
            this.#animations[i].drawFrame(ctx, scale, player, display);
        }
    }


    addAnimation(animation) {
        this.#animations.push(animation);
    }

    // getters and setters
    getID() {
        return this.#id;
    }
    getXCoord() {
        return this.#xCoord;
    }
    getYCoord() {
        return this.#yCoord;
    }
    getNode() {
        return this.#node;
    }
    getSpeed() {
        return this.#speed;
    }
    getVectors() {
        return this.#vectors;
    }

    setID(newID) {
        this.#id = newID;
    }
    setXCoord(newX) {
        this.#xCoord = Math.round(newX * 10) / 10;
    }
    setYCoord(newY) {
        this.#yCoord = Math.round(newY * 10) / 10;
    }
    setNode(newNode) {
        this.#node = newNode;
    }
    setSpeed(newSpeed) {
        this.#speed = newSpeed;
    }
    setVectors(newVectors) {
        this.#vectors = newVectors;
    }
}