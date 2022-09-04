class Map {
	constructor(x, y, width, height, scale) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.scale = scale;
	}
	drawMap() {
		mctx.beginPath();
		var diffx = (this.width / 2) * this.scale
		var diffy = (this.height / 2) * this.scale
		mctx.rect(0, 0, this.width * this.scale, this.height * this.scale);
		mctx.stroke();
		var a = 1
		while (a < 10) {
			mctx.beginPath();
			var b = a * 200 * this.scale;
			mctx.moveTo(b, 0);
			mctx.lineTo(b, this.height);
			mctx.stroke();
			a ++;
		} 
		a = 1
		while (a < 10) {
			mctx.beginPath;
			b = a * 200 * this.scale;
			mctx.moveTo(0, b);
			mctx.lineTo(this.width, b);
			mctx.stroke();
			a ++;
		}
	}
}