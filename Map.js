class Map {
	constructor(name, x, y, width, height, scale, canvas) {
			this.name = name;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.scale = scale;
			this.canvas = canvas;
			this.mctx = this.canvas.getContext("2d");
			this.canvas.width = 2000;
			this.canvas.height = 2000;
	}

    /*
    draws map based on current position in canvas
    */
	drawMap() {
		this.mctx.beginPath();

        //intended to allow zooming in and out
		var diffx = (this.width / 2) * this.scale
		var diffy = (this.height / 2) * this.scale

		this.mctx.rect(0, 0, this.width * this.scale, this.height * this.scale);
		this.mctx.stroke();
		for (var a = 1; a < 10; a++) {
			this.mctx.beginPath();
			var b = a * 200 * this.scale;
			this.mctx.moveTo(b, 0);
			this.mctx.lineTo(b, this.height);
			this.mctx.stroke();
		} 
		for (var a = 1; a < 10; a++) {
			this.mctx.beginPath;
			b = a * 200 * this.scale;
			this.mctx.moveTo(0, b);
			this.mctx.lineTo(this.width, b);
			this.mctx.stroke();
		}
	}
}