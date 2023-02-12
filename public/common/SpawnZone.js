import GameObject from "./GameObject.js";

export default class SpawnZone extends GameObject {
    // fields
    #bounds;
    #width;
    #height;

    static DEFAULT_PROPERTIES = {
        opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
        Animation: {
            type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE
        }
    }

    /**
     * instantiates a new SpawnZone object
     * 
     * @param {String} id 
     * @param {AnimatedGame} game 
     * @param {Number} xCoord 
     * @param {Number} yCoord 
     * @param {Object} bounds 
     * @param {Object} properties 
     */
    constructor(id, game, xCoord, yCoord, bounds, properties) {
        super(id, game, xCoord, yCoord, properties);
        this.#bounds = bounds;
        this.#width = bounds.right - bounds.left;
        this.#height = bounds.bottom - bounds.top;
    }

    // getters and setters
    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }
    setBounds(newBounds) {
        this.#bounds = newBounds;
        this.#width = newBounds.right - newBounds.left;
        this.#height = newBounds.bottom - newBounds.top;
    }
    getBounds() {
        return this.#bounds;
    }

    // methods
    generateSpawnCoords() {
        var bounds = this.getBounds();
        return {
            x: bounds.left + Math.floor(Math.random() * (this.getWidth() + 1)),
            y: bounds.top + Math.floor(Math.random() * (this.getHeight() + 1))
        }
    }

}