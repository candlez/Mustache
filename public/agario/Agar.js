import Agent from "../common/Agent.js";
import Image from "../common/Image.js";

export default class Agar extends Agent {
    // fields
    #mass;

    /**
     * initializes an Agar object
     * 
     * @param {String} id - the unique ID of this Agar
     * @param {Game} game - the Game object to which this Agar belongs
     * @param {Boolean} isPlayer - whether or not this Agar is the player 
     * @param {Number} xCoord - where the agar is relative to the map
     * @param {Number} yCoord - where the agar is relative to the map
     * @param {Number} mass - the radius of the Agar
     * @param {String} color - the color of the Agar
     * @param {String} source - path to the image file for this Agar (optional)
     */
    constructor(id, game, isPlayer, xCoord, yCoord, mass, properties) {
        super(id, game, isPlayer, xCoord, yCoord, properties); // to-do fix this
        this.#mass = mass;
         // to-do move color to properties
    }

    // standard getters and setters
    getMass() {
        return this.#mass;
    }

    // real methods

    /**
     * eats an agar, adding its mass to its own
     * 
     * @param {Agar} agar - the Agar to be eaten
     */
    eatAgar(agar) {
        this.#mass += agar.getMass();
        this.setRadius(this.getMass());
        this.setWidth(this.getMass() * 2);
        this.setHeight(this.getMass() * 2);
        this.getGame().removeAgent(agar.getId());
    }
}