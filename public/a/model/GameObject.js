
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
    setNode(newNode) {
        this.#node = newNode;
    }
    getNode() {
        return this.#node;
    }
    setSpeed(newSpeed) {
        this.#speed = newSpeed;
    }
    getSpeed() {
        return this.#speed;
    }
}