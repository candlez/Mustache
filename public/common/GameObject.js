

/**
 * a GameObject is a drawable item that exists at a specific location in a game
 */
export default class GameObject {
    // fields
    #game;
    #ctx
    #xCoord;
    #yCoord;
    #canvasCoords;
    #width;
    #height;

    /**
     * initializes a new GameObject object
     * 
     * @param {AnimatedGame} game - the game to which this GameObject belongs
     * @param {Number} xCoord - the absolute position of the GameObject
     * @param {Number} yCoord - the absolute position of the GameObject
     * @param {Number} width
     * @param {Number} height
     */
    constructor(game, xCoord, yCoord, width, height) {
        this.#game = game;
        this.#ctx = game.getCTX();
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
        this.#canvasCoords = {x: null, y: null};
        this.#width = width;
        this.#height = height;
    }

    // standard getters and setters
    setGame(newGame) {
        this.#game = newGame;
        this.#ctx = newGame.getCTX();
    }
    getGame() {
        return this.#game;
    }
    setXCoord(newXCoord) {
        var half = this.getWidth() / 2
        var bounds = this.getGame().getMap().getBounds();
        if (newXCoord - half < bounds.left) {
            throw new RangeError("left bound violated");
        } else if (newXCoord + half >  bounds.right) {
            throw new RangeError("right bound violated");
        } else {
            this.#xCoord = newXCoord;
        }
        
    }
    getXCoord() {
        return this.#xCoord;
    }
    setYCoord(newYCoord) {
        var half = this.getHeight() / 2
        var bounds = this.getGame().getMap().getBounds();
        if (newYCoord - half < bounds.top) {
            throw new RangeError("top bound violated");
        } else if (newYCoord + half >  bounds.bottom) {
            throw new RangeError("bottom bound violated");
        } else {
            this.#yCoord = newYCoord;
        }
    }
    getYCoord() {
        return this.#yCoord;
    }
    setWidth(newWidth) {
        this.#width = newWidth;
    }
    getWidth() {
        return this.#width;
    }
    setHeight(newHeight) {
        this.#height = newHeight;
    }
    getHeight() {
        return this.#height;
    }
    getCanvasCoords() {
        return this.#canvasCoords;
    }
    getCTX() {
        return this.#ctx;
    }

    // actual methods
    /**
     * sets the coordinates of the Agent relative to the canvas
     * 
     * @param {Number} scale - the scale at which the Game is currently being animated
     */
    setCanvasCoords(scale) {
        this.#canvasCoords.x = 1000 + (scale * (this.getXCoord() - this.getGame().getPlayer().getXCoord()));
        this.#canvasCoords.y = 1000 + (scale * (this.getYCoord() - this.getGame().getPlayer().getYCoord()));
    }

    /**
     * changes the absolute coordinates of the Agent
     * 
     * @param {Number} xChange - the change to the xCoords
     * @param {Number} yChange - the change to the yCoords
     */
    move(xChange, yChange) {
        var half = {x: this.getWidth() / 2, y: this.getHeight() / 2};
        var bounds = this.getGame().getMap().getBounds();
        try {
            this.setXCoord(this.getXCoord() + xChange);
        } catch (error) {
            if (error.message == "left bound violated") {
                this.setXCoord(bounds.left + half.x);
            } else if (error.message == "right bound violated") {
                this.setXCoord(bounds.right - half.x);
            } else {
                console.log("strange error in movement");
            }
        }
        try {
            this.setYCoord(this.getYCoord() + yChange)
        } catch (error) {
            if (error.message == "top bound violated") {
                this.setYCoord(bounds.top + half.y);
            } else if (error.message == "bottom bound violated") {
                this.setYCoord(bounds.bottom - half.y);
            } else {
                console.log("strange error in movement");
            }
        }
    }

    /**
     * draws the GameObject on the canvas of the game to which it belongs
     * 
     * @param {Number} scale - the scale the GameObject is drawn at
     */
    draw(scale) {
        this.setCanvasCoords(scale);
        this.#ctx.beginPath();
        this.#ctx.rect(
            this.#canvasCoords.x - ((this.#width * scale) / 2),
            this.#canvasCoords.y - ((this.#height * scale) / 2),
            this.#width * scale,
            this.#height * scale
        );
        this.#ctx.fillStyle = "black";
        this.#ctx.fill();
    }
}