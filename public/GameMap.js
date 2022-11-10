import Image from './Image.js'

export default class GameMap {
	/**
	 * a map that the agars cannot go out of
	 * 
	 * @param {Game} game - game object that the GameMap belongs to
	 * @param {Number} xCoord - absolute x coordinate of the map
	 * @param {Number} yCoord - absolute y coordinate of the map
	 * @param {Number} width - width of the map (absolute)
	 * @param {Number} height - height of the map (absolute)
	 * @param {Number} squareSize - size of the squares in the grid
	 */
    constructor(game, xCoord, yCoord, width, height, squareSize, source) {
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

		this.image;
		if (typeof source == "string") {
			this.image = new Image(this.ctx, source, game.assetContainer.container, width, height);
			this.image.setDisplay("none");
		}
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

	/**
	 * 
	 * 
	 * @param {Number} scale 
	 * @param {Bounds Object} bounds 
	 * @param {String} color 
	 */
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
	 * @param {Number} scale - the scale at which the map is drawn
     */
    drawMap(scale) {
		// update the corner and canvasCords fields
		this.setCanvasCoords(scale)
		if (typeof this.image == "object") {
			this.image.drawImageOnCanvas(
				this.ctx,
				this.canvasBounds.left,
				this.canvasBounds.top,
				this.width * scale,
				this.height * scale
			);
		} else {
			this.drawGrid(scale, this.canvasBounds, this.lineColor);
		}
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