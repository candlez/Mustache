import GameObject from "./GameObject.js";


export default class Agent extends GameObject {
    // fields
    #id;
    #isPlayer;

    /**
     * initializes a new Agent object
     * 
     * @param {String} id 
     * @param {AnimatedGame} game 
     * @param {Boolean} isPlayer 
     * @param {Number} xCoord 
     * @param {Number} yCoord 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(id, game, isPlayer, xCoord, yCoord, width, height) {
        super(game, xCoord, yCoord, width, height);
        this.#id = id;
        this.#isPlayer = isPlayer;
    }

    // standard getters and setters
    setIsPlayer(newIsPlayer) {
        this.#isPlayer = newIsPlayer;
    }
    getIsPlayer() {
        return this.#isPlayer;
    }
    setId(newId) {
        this.#id = newId;
    }
    getId() {
        return this.#id;
    }

    // real methods

}