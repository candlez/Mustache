
export default class GameObject {
    // fields
    #id;
    #xCoord;
    #yCoord;
    #animations;
    #speed;
    #node;

    constructor(id, xCoord, yCoord) {
        this.#id = id;
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
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

    setID(newID) {
        this.#id = newID;
    }
    setXCoord(newX) {
        this.#xCoord = Math.round(newX);
    }
    setYCoord(newY) {
        this.#yCoord = Math.round(newY);
    }
    setNode(newNode) {
        this.#node = newNode;
    }
    setSpeed(newSpeed) {
        this.#speed = newSpeed;
    }
}