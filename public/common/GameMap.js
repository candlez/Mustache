import Image from './Image.js'

export default class GameMap {
	// fields
	#game;
	#xCoord;
	#yCoord;
	#bounds;
	#sideLength;
	#properties;
	#image;

	static PROPERTIES = {
		ANIMATION: {
			TYPE: {
				NONE: 0,
				IMAGE: 1,
				SQUARE: 2,
			}
		}
	}

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
    constructor(game, xCoord, yCoord, sideLength, properties) {
		this.#game = game;

		// these are the absolute coordinates
		// x and y coords should represent the center
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;

		this.#sideLength = sideLength;

		var half = sideLength / 2;
		this.#bounds = { // setting bounds
			top: yCoord - half,
			bottom: yCoord + half,
			left: xCoord - half, 
			right: xCoord + half
		};
		this.#properties = properties;
		if (properties.animation.type == GameMap.PROPERTIES.ANIMATION.TYPE.IMAGE) { // setting up image field
			this.#image = new Image(
				"map",
				properties.animation.source,
				game.getAssetContainer().getContainer(), 
				sideLength,
				sideLength
			)
		}
    }

	static propertyValidation(properties) {
		if (properties == undefined) {
			throw new TypeError("GameMap has no properties");
		}
		if (properties.animation == undefined) {
			throw new TypeError("Gamemap has no animation properties");
		}
		if (typeof properties.animation.type == "number") {
			throw new TypeError("Gamemap has no animation type");
		} else {
			switch (properties.animation.type) {
				case 0: // none
					break;
				case 1: // image properties
					if (typeof properties.animation.source != "string") {
						throw new TypeError("Image source invalid");
					}
					break;
				case 2: // square properties
					if (typeof properties.animation.squareSize != "number") {
						throw new TypeError("Square squareSize is invalid");
					} else if (typeof properties.animation.squaresPerSide != "number") {
						throw new TypeError("Square squaresPerSide is invalid");
					} else if (typeof properties.animation.backgroundColor != "string") {
						throw new TypeError("Square backgroundColor is invalid");
					} else if (typeof properties.animation.lineColor != "string") {
						throw new TypeError("Square lineColor is invalid");
					}
			}
		}
	}

	// standard getters and setters
	getGame() {
		return this.#game;
	}
	getCTX() {
		return this.getGame().getCTX();
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
	getSideLength() {
		return this.#sideLength;
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
	// properties
	getProperties() {
		return this.#properties;
	}
	getAnimationType() {
		return this.getProperties().animation.type;
	}
	getSquareSize() {
		return this.getProperties().animation.squareSize;
	}
	getSquaresPerSide() {
		return this.getProperties().animation.squaresPerSide;
	}
	setBackgroundColor(newBackgroundColor) {
		this.#properties.animation.backgroundColor = newBackgroundColor;
	}
	getBackgroundColor() {
		return this.getProperties().animation.backgroundColor;
	}
	setLineColor(newLineColor) {
		this.#properties.animation.lineColor = newLineColor;
	}
	getLineColor() {
		return this.getProperties().animation.lineColor;
	}
	

	// real methods

	getCanvasCoords(scale) {
		var playerX = this.getGame().getPlayer().getXCoord();
		var playerY = this.getGame().getPlayer().getYCoord();
		var centerX = this.getGame().getWidth() / 2;
		var centerY = this.getGame().getHeight() / 2;
		return {
			x: centerX + (scale * (this.getXCoord() - playerX)),
			y: centerY + (scale * (this.getXCoord() - playerY))
		}
	}

	getCanvasBounds(scale) {
		var playerX = this.getGame().getPlayer().getXCoord();
		var playerY = this.getGame().getPlayer().getYCoord();
		var centerX = this.getGame().getWidth() / 2;
		var centerY = this.getGame().getHeight() / 2;
		return {
			top: centerY + (scale * (this.getBounds().top - playerY)),
			bottom: centerY + (scale * (this.getBounds().bottom - playerY)),
			left: centerX + (scale * (this.getBounds().left - playerX)),
			right: centerX + (scale * (this.getBounds().right - playerX))
		};
	}

	/**
	 * these boundaries are absolute coordinates that represent the
	 * edges of the map
	 */
	setBounds() {
		const half = this.getSideLength() / 2;
		this.#bounds.top = this.getYCoord() - half;
		this.#bounds.bottom = this.getYCoord() + half;
		this.#bounds.left = this.getXCoord() - half;
		this.#bounds.right = this.getXCoord() + half;
	}

	/**
	 * sets the squareSize and the number of squares
	 * 
	 * @param {Number} squareSize - number of pixels the squares should be
	 */
	setSquareSize(squareSize) {
		this.#properties.animation.squareSize = squareSize;
		this.#properties.animation.squaresPerSide = this.getSideLength() / squareSize;
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
		const scaledSideLength = this.getSideLength() * scale;
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		ctx.rect(
			bounds.left,
			bounds.top,
			scaledSideLength,
			scaledSideLength
		);
		ctx.stroke();

		var diff = this.getSquareSize() * scale;

		// vertical lines
		for (var a = 1; a < this.getSquaresPerSide(); a++) {
			ctx.beginPath();
			var b = a * diff;
			ctx.moveTo(bounds.left + b, bounds.top);
			ctx.lineTo(bounds.left + b, bounds.bottom);
			ctx.stroke();
		}
		// horizontal lines
		for (var a = 1; a < this.getSquaresPerSide(); a++) {
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
		const bounds = this.getCanvasBounds(scale);
		const scaledSideLength = this.getSideLength() * scale;
		switch (this.getAnimationType()) {
			case 0: // none
				break;
			case 1: // drawing an image
				console.log(this.getImage(), this.getCTX(), bounds, scaledSideLength, "drawn as image")
				this.getImage().drawImageOnCanvas(
					this.getCTX(),
					bounds.left,
					bounds.top,
					scaledSideLength,
					scaledSideLength
				);
				break;
			case 2: // drawing a grid
				this.drawGrid(scale, bounds, this.getLineColor());
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

	changeSource(newSource) { // to-do: align this with properties
		if (newSource == "none") {
			this.setImage(null);
		} else {
			this.setImage(new Image(
				"map", 
				newSource, 
				this.getGame().getAssetContainer().getContainer(), 
				this.getSideLength(), 
				this.getSideLength()
			))
		}
	}
}