export default class Agent {
    constructor(id, game, isPlayer, xCoord, yCoord, width, height) {
        this.id = id;
        this.game = game;
        this.ctx = game.ctx;

        this.isPlayer = isPlayer;

        // absolute coordinates
        this.xCoord = xCoord;
        this.yCoord = yCoord;

        // these coordinates are relative to the canvas
        this.canvasCoords = {x: null, y: null}
    }

    /**
     * sets the coordinates of the Agent relative to the canvas
     * 
     * @param {Number} scale - the scale at which the Game is currently being animated
     */
    setCanvasCoords(scale) {
        this.canvasCoords.x = 1000 + (scale * (this.xCoord - this.game.playerAgent.xCoord));
        this.canvasCoords.y = 1000 + (scale * (this.yCoord - this.game.playerAgent.yCoord));
    }

    /**
     * changes the absolute coordinates of the Agent
     * 
     * @param {Number} xChange - the change to the xCoords
     * @param {Number} yChange - the change to the yCoords
     */
    moveAgent(xChange, yChange) {
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
}