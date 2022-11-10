import Image from './Image.js'

export default class Agar{
    constructor(id, game, isPlayerAgar, xCoord, yCoord, mass, color, source) {        
        this.id = id;
        this.game = game;
        this.ctx = game.ctx;

        // these coordinates are absolute
        this.xCoord = xCoord;
        this.yCoord = yCoord;

        this.mass = mass;
        this.color = color;


        this.isPlayerAgar = isPlayerAgar;

        // these coordinates are relative to the canvas
        this.canvasCoords = {x: null, y: null}

        this.image;
        if (typeof source == "string") {
            this.image = new Image(id, source, game.assetContainer.container, mass * 2, mass * 2);
            this.image.setDisplay("none");
        }
    }

    /**
     * 
     * @param {Number} scale - 
     */
    setCanvasCoords(scale) {
        this.canvasCoords.x = 1000 + (scale * (this.xCoord - this.game.playerAgar.xCoord));
        this.canvasCoords.y = 1000 + (scale * (this.yCoord - this.game.playerAgar.yCoord));
    }

    /**
     * draws the agar
     * 
     * mass * scale = radius
     * 
     * when scale = 1, 1 mass = 1 radius pixel
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
     * eats an agar, adding its mass to ours
     * 
     * @param {Agar} agar - the agar to be eaten
     */
    eatAgar(agar) {
        this.mass += agar.mass;
        this.game.removeAgar(agar.id);
    }

    /**
     * changes the absolute coordinates of the Agar
     * 
     * @param {Number} xChange 
     * @param {Number} yChange 
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