import Agent from "../common/Agent.js";
import Image from "../common/Image.js";

export default class Agar extends Agent {
    // fields
    #mass;
    #color;
    #image;

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
    constructor(id, game, isPlayer, xCoord, yCoord, mass, color, source) {
        super(id, game, isPlayer, xCoord, yCoord, mass, mass);   

        this.#mass = mass;
        this.#color = color;

        // this is the optional image source
        this.#image;
        if (typeof source == "string") {
            this.#image = new Image(id, source, game.getAssetContainer().getContainer(), mass * 2, mass * 2);
            this.#image.setDisplay("none");
        }
    }

    // standard getters and setters
    getMass() {
        return this.#mass;
    }
    setColor(newColor) {
        this.#color = newColor;
    }
    getColor() {
        return this.#color;
    }
    getImage() {
        return this.#image;
    }

    // real methods
    /**
     * draws the agar
     * 
     * @param {Number} scale - the scale at which the agar is being drawn
     */
    draw(scale) {
        this.setCanvasCoords(scale);
        if (this.getImage() instanceof Image) {
            this.getImage().drawImageOnCanvas(
                this.getGame().getCTX(), 
                this.getCanvasCoords().x - (this.getMass() * scale), 
                this.getCanvasCoords().y - (this.getMass() * scale),
                this.getMass() * 2 * scale,
                this.getMass() * 2 * scale
            );
        } else {
            const ctx = this.getCTX();
            ctx.beginPath();
            ctx.arc(this.getCanvasCoords().x, this.getCanvasCoords().y, this.getMass() * scale, 0, Math.PI * 2);
            ctx.fillStyle = this.getColor();
            ctx.fill();
        }
    }

    /**
     * eats an agar, adding its mass to its own
     * 
     * @param {Agar} agar - the Agar to be eaten
     */
    eatAgar(agar) {
        this.#mass += agar.getMass();
        this.setWidth(this.getMass() * 2);
        this.setHeight(this.getMass() * 2);
        this.getGame().removeAgent(agar.getId());
    }
}