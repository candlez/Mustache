import Agent from "../common/Agent.js";

export default class Agar extends Agent {
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

        this.mass = mass;
        this.color = color;

        // this is the optional image source
        this.image;
        if (typeof source == "string") {
            this.image = new Image(id, source, game.assetContainer.container, mass * 2, mass * 2);
            this.image.setDisplay("none");
        }
    }

    /**
     * draws the agar
     * 
     * @param {Number} scale - the scale at which the agar is being drawn
     */
    draw(scale) {
        this.setCanvasCoords(scale);
        if (typeof this.image == "object") {
            this.image.drawImageOnCanvas(
                this.ctx, 
                this.canvasCoords.x - (this.mass * scale), 
                this.canvasCoords.y - (this.mass * scale),
                this.mass * 2 * scale,
                this.mass * 2 * scale
            );
        } else {
            this.ctx.beginPath();
            this.ctx.arc(this.canvasCoords.x, this.canvasCoords.y, this.mass * scale, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    /**
     * eats an agar, adding its mass to its own
     * 
     * @param {Agar} agar - the Agar to be eaten
     */
    eatAgar(agar) {
        this.mass += agar.mass;
        this.game.removeAgar(agar.id);
    }
}