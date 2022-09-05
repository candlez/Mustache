class Agar {

	constructor(name, x, y, mass, color, game, canvas) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.mass = mass;
		this.color = color;
		game.agars.push(this);
		this.psctx = canvas;
	}

	/*
	draws an agar based on current position
	*/
	drawAgar() {
		// console.log(this.psctx);
		this.psctx.beginPath();
		this.psctx.arc(this.x, this.y, this.mass, 0, Math.PI * 2);
		this.psctx.fillStyle = this.color;
		this.psctx.fill();
	}

	/*
	not sure what this is for
	*/
	moveAgar(direction) {
		a = [[0, 1], [1, 0], [0, -1], [-1, 0]]

	}
}