import Agent from "../common/Agent.js"

/**
 * 
 */
export default class Razor extends Agent {

    /**
     * 
     * @param {*} id 
     * @param {*} game 
     * @param {*} isPlayer 
     * @param {*} xCoord 
     * @param {*} yCoord 
     */
    constructor(id, game, isPlayer, xCoord, yCoord, properties) {
        super(id, game, isPlayer, xCoord, yCoord, properties);
    }
}