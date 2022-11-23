import Image from './Image.js'

export default class Agar{
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
        this.id = id;
        this.game = game;
        this.ctx = game.ctx;

        // these coordinates are absolute
        this.xCoord = xCoord;
        this.yCoord = yCoord;

        this.mass = mass;
        this.color = color;


        this.isPlayer = isPlayer;

        // these coordinates are relative to the canvas
        this.canvasCoords = {x: null, y: null}

        // this is the optional image source
        this.image;
        if (typeof source == "string") {
            this.image = new Image(id, source, game.assetContainer.container, mass * 2, mass * 2);
            this.image.setDisplay("none");
        }
    }

    /**
     * sets the coordinates of the Agar relative to the canvas
     * 
     * @param {Number} scale - the scale at which the Game is currently being animated
     */
    setCanvasCoords(scale) {
        this.canvasCoords.x = 1000 + (scale * (this.xCoord - this.game.playerAgar.xCoord));
        this.canvasCoords.y = 1000 + (scale * (this.yCoord - this.game.playerAgar.yCoord));
    }

    /**
     * draws the agar
     * 
     * @param {Number} scale - the scale at which the agar is being drawn
     */
    drawAgar(scale) {
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

    /**
     * changes the absolute coordinates of the Agar
     * 
     * @param {Number} xChange - the change to the xCoords
     * @param {Number} yChange - the change to the yCoords
     */
    moveAgar(xChange, yChange) {
        var newX = this.xCoord + xChange;
        if (newX - this.mass >= this.game.map.bounds.left) {
            if (newX + this.mass <= this.game.map.bounds.right) {
                this.xCoord = newX;
            } else {
                this.xCoord = this.game.map.bounds.right - this.mass;
            }
        } else {
            this.xCoord = this.game.map.bounds.left + this.mass;
        }
        var newY = this.yCoord + yChange;
        if (newY - this.mass >= this.game.map.bounds.top) {
            if (newY + this.mass <= this.game.map.bounds.right) {
                this.yCoord = newY;
            } else {
                this.yCoord = this.game.map.bounds.right - this.mass;
            }
        } else {
            this.yCoord = this.game.map.bounds.top + this.mass;
        }
    }
}