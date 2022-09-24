class Agar extends Map {
	constructor(name, x, y, mass, color, canvas, isPlayer) {
		super(name, x, y, 2000, 2000, 0, "white", canvas);
		this.mass = mass;
		this.color = color;
		this.isPlayer = isPlayer
	}

	/**
	 * draws an agar based on current position
	 */
	drawAgar() {
		// console.log(this.psctx);
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.mass, 0, Math.PI * 2);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}

	/**
	 * deletes the Agar
	 */

	/**
	 * carries out all operations that are associated with
	 * eating another Agar. 
	 * 
	 * This potentially includes:
	 * 1. changing mass
	 * 2. changing position
	 * 3. an animation
	 * 
	 * @param {Agar object} agar 
	 */
	eatAgar(agar) {
		// changes mass and deletes smaller agar 
		this.mass = this.mass + agar.mass;
		agar.mass = 0;
		agar.x = 0;
		agar.y = 0;
		this.deleteAgar(agar);

		// changes position (involves animation)


		// additional animation?
	}
}