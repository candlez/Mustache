class Agar extends Map {
	constructor(name, x, y, mass, color, canvas, isPlayer) {
		super(name, x, y, 2000, 2000, 0, "white", canvas);
		this.mass = mass;
		this.color = color;
		this.isPlayer = isPlayer
	}

	/*
	draws an agar based on current position
	*/
	drawAgar() {
		// console.log(this.psctx);
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.mass, 0, Math.PI * 2);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}
}