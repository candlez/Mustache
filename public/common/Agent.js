import GameObject from "./GameObject.js";


export default class Agent extends GameObject {
    // fields
    #isPlayer;

    /**
     * initializes a new Agent object
     *  
     * @param {String} id
     * @param {AnimatedGame} game 
     * @param {Boolean} isPlayer 
     * @param {Number} xCoord 
     * @param {Number} yCoord 
     * @param {Object} properties
     */
    constructor(id, game, isPlayer, xCoord, yCoord, properties) {
        super(id, game, xCoord, yCoord, properties);
        this.#isPlayer = isPlayer;
    }

    // standard getters and setters
    setIsPlayer(newIsPlayer) {
        this.#isPlayer = newIsPlayer;
    }
    getIsPlayer() {
        return this.#isPlayer;
    }

    // real methods

}