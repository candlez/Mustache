

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
        this.#xCoord = newXCoord;
    }
    getXCoord() {
        return this.#xCoord;
    }
    setYCoord(newYCoord) {
        this.#yCoord = newYCoord;
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
        var newX = this.getXCoord() + xChange;
        if (newX - (this.getWidth() / 2) >= this.getGame().getMap().getBounds().left) {
            if (newX + (this.getWidth() / 2) <= this.getGame().getMap().getBounds().right) {
                this.setXCoord(newX);
            } else {
                this.setXCoord(this.getGame().getMap().getBounds().right - (this.getWidth() / 2));
            }
        } else {
            this.setXCoord(this.getGame().getMap().getBounds().left + (this.getWidth() / 2));
        }
        var newY = this.getYCoord() + yChange;
        if (newY - (this.getHeight() / 2) >= this.getGame().getMap().getBounds().top) {
            if (newY + (this.getHeight() / 2) <= this.getGame().getMap().getBounds().right) {
                this.setYCoord(newY);
            } else {
                this.getYCoord(this.getGame().getMap().getBounds().right - (this.getHeight() / 2));
            }
        } else {
            this.getYCoord(this.getGame().getMap().getBounds().top + (this.getHeight() / 2));
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