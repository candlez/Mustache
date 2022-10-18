export default class GameMap {
    constructor(xCoord, yCoord, width, height, ctx) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
		this.width = width;
		this.height = height;
		this.ctx = ctx;
		
        

        this.backgroundColor = "white";
    }

    /**
     * draws the map on the playspace
     */
    drawMap() {
        this.ctx.beginPath();
		this.ctx.strokeStyle = "silver";

        this.ctx.rect(this.xCoord, this.yCoord, this.width, this.height);
		this.ctx.stroke();

		var diff = this.width / 10

        for (var a = 1; a < 10; a++) {
			this.ctx.beginPath();
			var b = a * diff;
			this.ctx.moveTo(b + this.xCoord, this.yCoord);
			this.ctx.lineTo(b + this.xCoord, this.height + this.yCoord);
			this.ctx.stroke();
		} 
		for (var a = 1; a < 10; a++) {
			this.ctx.beginPath;
			b = a * diff;
			this.ctx.moveTo(this.xCoord, b + this.yCoord);
			this.ctx.lineTo(this.width + this.xCoord, b + this.yCoord);
			this.ctx.stroke();
		}
    }
}