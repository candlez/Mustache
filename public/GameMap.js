export default class GameMap {
    constructor(game, xCoord, yCoord, width, height, squareSize) {
		this.game = game;
		this.ctx = game.ctx;

		// these are the absolute coordinates
		// x and y coords should represent the center
        this.xCoord = xCoord;
        this.yCoord = yCoord;
		this.bounds = {
			top: yCoord - (height / 2),
			bottom: yCoord + (height / 2),
			left: xCoord - (width / 2), 
			right: xCoord + (width / 2)
		};

		this.width = width;
		this.height = height;

		// canvas coordinates for drawing
		this.canvasCoords = {x: null, y: null};
		this.canvasBounds = {top: null, bottom: null, left: null, right: null};

		this.squareSize = squareSize;
		this.numOfSquares = width / squareSize;
        this.backgroundColor = "white";
		this.lineColor = "silver"
    }

	/**
	 * 
	 * 
	 * @param {Number} scale 
	 */
	setCanvasCoords(scale) {
		var playerX = this.game.playerAgar.xCoord;
		var playerY = this.game.playerAgar.yCoord;

		this.canvasCoords.x = 1000 + (scale * (this.xCoord - playerX));
		this.canvasCoords.y = 1000 + (scale * (this.yCoord - playerY));

		this.canvasBounds.top = 1000 + (scale * (this.bounds.top - playerY));
		this.canvasBounds.bottom = 1000 + (scale * (this.bounds.bottom - playerY));
		this.canvasBounds.left = 1000 + (scale * (this.bounds.left - playerX));
		this.canvasBounds.right = 1000 + (scale * (this.bounds.right - playerX));
	}

	/**
	 * these boundaries are absolute coordinates that represent the
	 * edges of the map
	 */
	setBounds() {
		this.bounds.top = this.yCoord - (this.height / 2);
		this.bounds.bottom = this.yCoord + (this.height / 2);

		this.bounds.left = this.xCoord - (this.width / 2);
		this.bounds.right = this.xCoord + (this.width / 2);
	}

	/**
	 * 
	 * @param {Number} squareSize number of pixels the squares should be
	 */
	setSquareSize(squareSize) {
		this.squareSize = squareSize;
		this.numOfSquares = this.width / squareSize;
	}

	drawGrid(scale, bounds, color) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = color;

		this.ctx.rect(
			bounds.left,
			bounds.top,
			this.width * scale,
			this.height * scale
		);
		this.ctx.stroke();

		var diff = this.squareSize * scale;

		// vertical lines
		for (var a = 1; a < this.numOfSquares; a++) {
			this.ctx.beginPath();
			var b = a * diff;
			this.ctx.moveTo(bounds.left + b, bounds.top);
			this.ctx.lineTo(bounds.left + b, bounds.bottom);
			this.ctx.stroke();
		}
		// horizontal lines
		for (var a = 1; a < this.numOfSquares; a++) {
			this.ctx.beginPath();
			var b = a * diff;
			this.ctx.moveTo(bounds.left, bounds.top + b);
			this.ctx.lineTo(bounds.right, bounds.top + b);
			this.ctx.stroke();
		}
	}

    /**
     * draws the map on the playspace
	 * 
	 * n = w / 100
	 * 100n = w
	 * 
	 * d = (w * scale) / n
	 * d = scale * (100n / n)
	 * d = scale * 100
	 * 
	 * scaling is done based on top left corner
	 * 
	 * needs to be based on center
	 * 
	 * @param {Number} scale - the scale at which the map is drawn
     */
    drawMap(scale) {
		// update the corner and canvasCords fields
		this.setCanvasCoords(scale)

        this.drawGrid(scale, this.canvasBounds, this.lineColor);
    }

	/**
	 * updates the absolute coordinates of the map based on
	 * the x and y components of the change
	 * 
	 * this method should omly be called very rarely
	 * 
	 * @param {Number} xChange - x component of change
	 * @param {Number} yChange - y component of change
	 */
	moveMap(xChange, yChange) {
		this.xCoord += xChange;
		this.yCoord += yChange;
		this.setBounds();
	}
}