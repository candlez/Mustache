import Agent from "./Agent.js";
import GameMap from './GameMap.js'
import AssetContainer from './AssetContainer.js';
import GameObject from "./GameObject.js";

export default class AnimatedGame {
    // fields
    #width;
    #height;
    #canvas;
    #ctx;
    #gameState;
    #map;
    #miniMap;
    #assetContainer;
    #movementKeyLogger;
    #agents;
    #objects;
    #player;
    #scale;
    #socket

    /**
     * initializes an AnimatedGame object
     * 
     * @param {Number} width - the width of the canvas
     * @param {Number} height - the height of the canvas
     */
    constructor(width, height) {
        // takes parameters
        this.#width = width;
        this.#height = height;

        // creates a canvas with parameters, adds it to body
        this.#canvas = document.createElement('canvas');
        this.#canvas.id = "playSpace";
        document.body.appendChild(this.#canvas);
        this.#canvas.width = width;
        this.#canvas.height = height;

        // creates context
        this.#ctx = this.#canvas.getContext('2d');

        // fields
        this.#gameState = false;
        this.#map = null;
        this.#miniMap = null;
        this.#assetContainer = null;
        this.#movementKeyLogger = null;
        this.#agents = [];
        this.#objects = [];
        this.#player = null;
        this.#scale = 1;

        this.#socket = io.connect('http://localhost:5000')
    }

    // standard getters and setters
    setWidth(newWidth) {
        this.#width = newWidth;
    }
    getWidth() {
        return this.#width;
    }
    setHeight(newHeight) {
        this.#height = newHeight;
        this.#canvas.height = newHeight;
    }
    getHeight() {
        return this.#height;
    }
    setMap(newMap) {
        if (newMap instanceof GameMap) {
            this.#map = newMap;
        }
    }
    getMap() {
        return this.#map;
    }
    getAgents() {
        return this.#agents; 
    }
    getObjects() {
        return this.#objects;
    }
    setScale(scale) {
        this.#scale = scale;
    }
    getScale() {
        return this.#scale;
    }
    setMiniMap(newMiniMap) {
        this.#miniMap = newMiniMap;
    }
    getMiniMap() {
        return this.#miniMap;
    }
    getCTX() {
        return this.#ctx;
    }
    setCanvas(newCanvas) {
        this.#canvas = newCanvas;
        this.#ctx = newCanvas.getContext('2d');
    }
    getCanvas() {
        return this.#canvas;
    }
    setAssetContainer(newAssetContainer) {
        if (newAssetContainer instanceof AssetContainer) {
            this.#assetContainer = newAssetContainer;
        }
    }
    getAssetContainer() {
        return this.#assetContainer;
    }
    setMovementKeyLogger(newMovementKeyLogger) {
        this.#movementKeyLogger = newMovementKeyLogger;
    }
    getMovementKeyLogger() {
        return this.#movementKeyLogger;
    }
    setGameState(newGameState) {
        this.#gameState = newGameState;
    }
    getGameState() {
        return this.#gameState;
    }
    setPlayer(newPlayer) {
        this.#player = newPlayer;
    }
    getPlayer() {
        return this.#player;
    }
    getSocket() {
        return this.#socket;
    }

    // real methods
    /**
     * adds an Agent object to the list
     * 
     * @param agent - Agent object being added to the game
     */
    addAgent(agent) {
        if (agent instanceof Agent) {
            this.#agents.push(agent);
        }
        if (agent.getIsPlayer()) {
            this.setPlayer(agent);
        }
    }

    /**
     * removes all the Agents with a given id
     * 
     * @param id - string that identifies the agents to be removed
     */
    removeAgent(id) {
        var indices = [];
        var flag = false;
        this.getAgents().forEach(function(agent, index) {
            if (agent.getID() == id) {
                indices.push(index);
                if (agent.getIsPlayer()) {
                    flag = true;
                    agent.getGame().getPlayer() = null;
                }
            }
        })
        for (var i = indices.length - 1; i > -1; i--) {
            this.getAgents().splice(indices[i], 1);
        }
        this.setGameState(false);
        // needs testing
    }

    /**
     * calculates the change to x and y values of objects being moved
     */
    interpretKeys() {
        var loggers = this.getMovementKeyLogger().getKeyLoggers();
        var unitVectors = [
            loggers.get("d").getKeyDown() + // d
            (-1 * loggers.get("a").getKeyDown()), // a
            (-1 * loggers.get("w").getKeyDown()) + // w
            loggers.get("s").getKeyDown() // s
        ];
        if (unitVectors[0] == 0 || unitVectors[1] == 0) {
            return {
                x: 10 * unitVectors[0],
                y: 10 * unitVectors[1]
            }
        } else {
            return {
                x: 7 * unitVectors[0],
                y: 7 * unitVectors[1]
            }
        }
    }

    /**
     * updates posiiton data so the objects can be drawn
     * 
     * also updates scale data
     */
    updatePositionData() {
        var change = this.interpretKeys();
        if (change.x != 0 || change.y != 0) {
            this.getPlayer().move(change.x, change.y)
            var data = {
                id: this.getPlayer().getID(),
                xCoord: this.getPlayer().getXCoord(),
                yCoord: this.getPlayer().getYCoord()
            }
            this.getSocket().emit("playerMoved", data);
        }
    }

    /**
     * clears the whole play space of drawings
     */
    clearPlaySpace() {
        const ctx = this.getCTX();
        ctx.beginPath();
        ctx.rect(0, 0, this.getCanvas().width, this.getCanvas().height);
        ctx.fillStyle = this.getMap().getBackgroundColor();
        ctx.fill();
    }

    /**
     * gets the width and height of a page for elements that need
     * to be scaled based on window size
     * 
     * @returns - an array of the page width and height
     */
    getPageDimensions() {
        return [window.innerWidth, window.innerHeight];
    }

    /**
     * draws all objects on the play space
     */
    drawObjects() {
        this.getMiniMap().animate();
        this.getMap().draw(this.getScale());
        for (var i = this.getAgents().length; i > 0; i--) {
            this.getAgents()[i - 1].draw(this.getScale());
        }
    }

    /**
     * draws a frame based on currently available data
     */
    animateFrame() {
        this.clearPlaySpace(); // erase everything from the previous frame
        this.drawObjects(); // draw the objects
    }

    /**
     * 
     * @param {Number} xCoord 
     * @param {Number} yCoord 
     * @returns 
     */
    isOutOfBounds(xCoord, yCoord) {
        const bounds = this.getMap().getBounds();
        return (xCoord < bounds.left || xCoord > bounds.right || yCoord < bounds.top || yCoord > bounds.bottom);
    }

    isLegalPoint(xCoord, yCoord) {
        if (this.isOutOfBounds(xCoord, yCoord)) {
            return false;
        } else {
            var result = true
            this.getObjects().forEach((object) => { // checking objects
                if (object.getOpacity() == GameObject.PROPERTIES.OPACITY.BLOCKING) {
                    if (object.isPointWithinBounds(xCoord, yCoord)) {
                        result = false;
                    }
                }
            });
            this.getAgents().forEach((agent) => { // checking agents
                if (agent.getOpacity() == GameObject.PROPERTIES.OPACITY.BLOCKING) {
                    if (agent.isPointWithinBounds(xCoord, yCoord)) {
                        result = false;
                    }
                }
            });
            return result;
        }
    }

    waitForMovement() {
        this.getSocket().on("playerMoved", (data) => {
            this.getAgents().forEach((agent) => {
                if (agent.getID() == data.id) {
                    agent.move(data.xCoord - agent.getXCoord(), data.yCoord - agent.getYCoord())
                }
            })
        })
    }

    static playGame(width, height) {
        const game = new AnimatedGame(width, height);
    }
}