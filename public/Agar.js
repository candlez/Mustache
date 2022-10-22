export default class Agar{
    constructor(id, game, isPlayerAgar, xCoord, yCoord, mass, color, ctx) {        
        this.id = id;
        this.game = game;

        // these coordinates are absolute
        this.xCoord = xCoord;
        this.yCoord = yCoord;

        this.mass = mass;
        this.color = color;
        this.ctx = ctx;

        this.isPlayerAgar = isPlayerAgar;

        // these coordinates are relative to the canvas
        this.canvasCoords = {x: null, y: null}
    }

    /**
     * 
     * @param {Number} scale - 
     */
    setCanvasCoords(scale) {
        this.canvasCoords.x = 1000 + (scale * (this.xCoord - this.game.playerAgar.xCoord));
        this.canvasCoords.y = 1000 + (scale * (this.yCoord - this.game.playerAgar.yCoord));
        // console.log(this.canvasCoords.x, this.canvasCoords.y)
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
        this.ctx.beginPath();
		this.ctx.arc(this.canvasCoords.x, this.canvasCoords.y, this.mass * scale, 0, Math.PI * 2);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
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
     * 
     * 
     * @param {Number} xChange 
     * @param {Number} yChange 
     */
    moveAgar(xChange, yChange) {
        this.xCoord += xChange;
        this.yCoord += yChange;
    }
}