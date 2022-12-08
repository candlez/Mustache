import Image from './Image.js'

export default class GameMap {
	// fields
	#game;
	#ctx;
	#xCoord;
	#yCoord;
	#bounds;
	#width;
	#height;
	#canvasCoords;
	#canvasBounds;
	#squareSize;
	#numOfSquares;
	#backgroundColor;
	#lineColor;
	#image;

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
		this.#game = game;
		this.#ctx = game.getCTX();

		// these are the absolute coordinates
		// x and y coords should represent the center
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
		this.#bounds = {
			top: yCoord - (height / 2),
			bottom: yCoord + (height / 2),
			left: xCoord - (width / 2), 
			right: xCoord + (width / 2)
		};

		this.#width = width;
		this.#height = height;

		// canvas coordinates for drawing
		this.#canvasCoords = {x: null, y: null};
		this.#canvasBounds = {top: null, bottom: null, left: null, right: null};

		this.#squareSize = squareSize;
		this.#numOfSquares = width / squareSize;
        this.#backgroundColor = "white";
		this.#lineColor = "silver"

		if (typeof source == "string") {
			this.#image = new Image("map", source, game.getAssetContainer().getContainer(), width, height);
			this.#image.setDisplay("none");
		}
    }

	// standard getters and setters
	getGame() {
		return this.#game;
	}
	getCTX() {
		return this.#ctx;
	}
	getXCoord() {
		return this.#xCoord;
	}
	getYCoord() {
		return this.#yCoord;
	}
	getBounds() {
		return this.#bounds;
	}
	getWidth() {
		return this.#width;
	}
	getHeight() {
		return this.#height;
	}
	getCanvasCoords() {
		return this.#canvasCoords;
	}
	getCanvasBounds() {
		return this.#canvasBounds;
	}
	getSquareSize() {
		return this.#squareSize;
	}
	getNumOfSquares() {
		return this.#numOfSquares;
	}
	setBackgroundColor(newBackgroundColor) {
		this.#backgroundColor = newBackgroundColor;
	}
	getBackgroundColor() {
		return this.#backgroundColor;
	}
	setLineColor(newLineColor) {
		this.#lineColor = newLineColor;
	}
	getLineColor() {
		return this.#lineColor;
	}
	getImage() {
		return this.#image;
	}
	setImage(newImage) {
		this.#image = newImage;
		if (newImage instanceof Image) {
			this.#image.setDisplay("none");
		}
	}

	// real methods
	/**
	 * sets the coordinates of the Map relative to the canvas
	 * 
	 * @param {Number} scale 
	 */
	setCanvasCoords(scale) {
		var playerX = this.getGame().getPlayer().getXCoord();
		var playerY = this.getGame().getPlayer().getYCoord();

		var centerX = this.getGame().getWidth() / 2
		var centerY = this.getGame().getHeight() / 2

		this.#canvasCoords.x = centerX + (scale * (this.getXCoord() - playerX));
		this.#canvasCoords.y = centerY + (scale * (this.getXCoord() - playerY));

		this.#canvasBounds.top = centerY + (scale * (this.getBounds().top - playerY));
		this.#canvasBounds.bottom = centerY + (scale * (this.getBounds().bottom - playerY));
		this.#canvasBounds.left = centerX + (scale * (this.getBounds().left - playerX));
		this.#canvasBounds.right = centerX + (scale * (this.getBounds().right - playerX));
	}

	/**
	 * these boundaries are absolute coordinates that represent the
	 * edges of the map
	 */
	setBounds() {
		const halfX = this.getWidth() / 2;
		const halfY = this.getHeight() / 2;
		this.#bounds.top = this.getYCoord() - halfY;
		this.#bounds.bottom = this.getYCoord() + halfY;
		this.#bounds.left = this.getXCoord() - halfX;
		this.#bounds.right = this.getXCoord() + halfX;
	}

	/**
	 * sets the squareSize and the number of squares
	 * 
	 * @param {Number} squareSize - number of pixels the squares should be
	 */
	setSquareSize(squareSize) {
		this.#squareSize = squareSize;
		this.#numOfSquares = this.getWidth() / squareSize;
	}

	/**
	 * draws a grid
	 * 
	 * @param {Number} scale 
	 * @param {Bounds Object} bounds 
	 * @param {String} color 
	 */
	drawGrid(scale, bounds, color) {
		const ctx = this.getCTX();
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.rect(
			bounds.left,
			bounds.top,
			this.getWidth() * scale,
			this.getHeight() * scale
		);
		ctx.stroke();

		var diff = this.getSquareSize() * scale;

		// vertical lines
		for (var a = 1; a < this.getNumOfSquares(); a++) {
			ctx.beginPath();
			var b = a * diff;
			ctx.moveTo(bounds.left + b, bounds.top);
			ctx.lineTo(bounds.left + b, bounds.bottom);
			ctx.stroke();
		}
		// horizontal lines
		for (var a = 1; a < this.getNumOfSquares(); a++) {
			ctx.beginPath();
			var b = a * diff;
			ctx.moveTo(bounds.left, bounds.top + b);
			ctx.lineTo(bounds.right, bounds.top + b);
			ctx.stroke();
		}
	}

    /**
     * draws the map on the playspace
	 * 
	 * @param {Number} scale - the scale at which the map is drawn
     */
    draw(scale) {
		// update the corner and canvasCords fields
		this.setCanvasCoords(scale)
		if (this.getImage() instanceof Image) {
			this.getImage().drawImageOnCanvas(
				this.getCTX(),
				this.getCanvasBounds().left,
				this.getCanvasBounds().top,
				this.getWidth() * scale,
				this.getHeight() * scale
			);
		} else {
			this.drawGrid(scale, this.getCanvasBounds(), this.getLineColor());
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
		this.#xCoord += xChange;
		this.#yCoord += yChange;
		this.setBounds();
	}

	changeSource(newSource) {
		if (newSource == "none") {
			this.setImage(null);
		} else {
			this.setImage(new Image(
				"map", 
				newSource, 
				this.getGame().getAssetContainer().getContainer(), 
				this.getWidth(), 
				this.getHeight()
			))
		}
	}
}