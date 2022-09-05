class Map extends Game {
	constructor(name, x, y, width, height, scale, backgroundColor, canvas) {
		super(canvas, width, height);
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.scale = scale;
		this.backgroundColor = backgroundColor;
	}

    /*
    draws map based on current position in canvas
    */
	drawMap() {
		this.ctx.beginPath();
		console.log(0, 0, this.width * this.scale, this.height * this.scale)
        // intended to allow zooming in and out
		var diffx = (this.width / 2) * this.scale
		var diffy = (this.height / 2) * this.scale

		this.ctx.rect(0, 0, this.width * this.scale, this.height * this.scale);
		this.ctx.stroke();
		for (var a = 1; a < 10; a++) {
			this.ctx.beginPath();
			var b = a * 200 * this.scale;
			this.ctx.moveTo(b + this.x, this.y);
			this.ctx.lineTo(b + this.x, this.height + this.y);
			this.ctx.stroke();
		} 
		for (var a = 1; a < 10; a++) {
			this.ctx.beginPath;
			b = a * 200 * this.scale;
			this.ctx.moveTo(this.x, b + this.y);
			this.ctx.lineTo(this.width + this.x, b + this.y);
			this.ctx.stroke();
		}
	}

	eraseMap() {

	}
}