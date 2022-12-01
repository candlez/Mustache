

/**
 * a GameObject is a drawable item that exists at a specific location in a game
 */
export default class GameObject {
    // fields
    #game;
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
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
        this.#canvasCoords = {x: null, y: null};
        this.#width = width;
        this.#height = height;
    }

    // standard getters and setters
    setGame(newGame) {
        this.#game = newGame;
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
        var newX = this.xCoord + xChange;
        if (newX - this.width >= this.game.map.bounds.left) {
            if (newX + this.width <= this.game.map.bounds.right) {
                this.xCoord = newX;
            } else {
                this.xCoord = this.game.map.bounds.right - this.width;
            }
        } else {
            this.xCoord = this.game.map.bounds.left + this.width;
        }
        var newY = this.yCoord + yChange;
        if (newY - this.height >= this.game.map.bounds.top) {
            if (newY + this.height <= this.game.map.bounds.right) {
                this.yCoord = newY;
            } else {
                this.yCoord = this.game.map.bounds.right - this.height;
            }
        } else {
            this.yCoord = this.game.map.bounds.top + this.height;
        }
    }

    /**
     * draws the GameObject on the canvas of the game to which it belongs
     * 
     * @param {Number} scale - the scale the GameObject is drawn at
     */
    draw(scale) {
        const ctx = this.#game.getCTX();
        ctx.beginPath();
        this.setCanvasCoords(scale);
        this.rect(
            this.#canvasCoords.x - ((this.#width * scale) / 2),
            this.#canvasCoords.y - ((this.#height * scale) / 2),
            this.#width * scale,
            this.#height * scale
        );
        ctx.fillStyle = "black";
        ctx.fill();
    }
}