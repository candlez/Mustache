export default class Agar{
    constructor(id, game, xCoord, yCoord, mass, color, ctx) {        
        this.id = id;
        this.game = game;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.mass = mass;
        this.color = color;
        this.ctx = ctx;
    }

    /**
     * draws the agar
     */
    drawAgar() {
        this.ctx.beginPath();
		this.ctx.arc(this.xCoord, this.yCoord, this.mass, 0, Math.PI * 2);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
    }

    /**
     * eats an agar, adding its mass to ours
     * 
     * @param {Agar} - the agar to be eaten
     */
    eatAgar(agar) {
        this.mass += agar.mass;
        this.game.removeAgar(agar.id);
    }
}