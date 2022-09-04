class Agar {
	constructor(x, y, mass, color) {
		this.x = x;
		this.y = y;
		this.mass = mass;
		this.color = color;
		agars.push(this);
	}
	drawAgar() {
		psctx.beginPath();
		psctx.arc(this.x, this.y, this.mass, 0, Math.PI * 2);
		psctx.fillStyle = this.color;
		psctx.fill();
	}
	moveAgar(direction) {
		a = [[0, 1], [1, 0], [0, -1], [-1, 0]]

	}
}