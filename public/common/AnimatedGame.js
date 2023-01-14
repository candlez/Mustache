import Agent from "./Agent.js";
import GameMap from './GameMap.js'
import AssetContainer from './AssetContainer.js';
import GameObject from "./GameObject.js";
import Agar from "../agario_game/Agar.js";

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
    #playerSpawnZone;
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
        this.#playerSpawnZone = null;
        this.#movementKeyLogger = null;
        this.#agents = new Map();
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
    setPlayerSpawnZone(newPlayerSpawnZone) {
        this.#playerSpawnZone = newPlayerSpawnZone;
    }
    getPlayerSpawnZone() {
        return this.#playerSpawnZone;
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
            this.#agents.set(agent.getID(), agent);
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
    removeAgent(id) { // needs to be revised because agents is now a map
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
                x: this.getPlayer().getXCoord(),
                y: this.getPlayer().getYCoord()
            }
            this.getSocket().emit("playerMoved", data);
        }
    }

    requestServerData() {
        this.getSocket().emit("requestServerData");
    }

    requestAgentProperties(id) {
        var data = {
            id: id,
        }
        this.getSocket().emit("requestProperties", data);
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
        for (const key of this.getAgents().keys()) {
            this.getAgents().get(key).draw(this.getScale());
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

    addAgentFromData(data) {
        this.requestAgentProperties(data.id);
        this.addAgent(new Agent(data.id, this.getGame(), false, data.x, data.y, { // properties (no animation style)
            animation: {
                type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE
            },
            opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE
        }))
    }

    updateAgents(agentsObject) {
        agentsObject.keys.forEach((key) => {
            // eventually, this exception for the client player may need revision
            // for example, if the server marks the player as dead, it woouldnt be able to tell rn
            if (key != this.getPlayer().getID()) {
                if (this.getAgents().get(key) == null) {
                    // adds new Agents
                    this.addAgentFromData(agentsObject[key])
                    this.requestAgentProperties(key)
                } else {
                    // updates existing agents
                    // try to make this less annoying
                    this.getAgents().get(key).setXCoord(agentsObject[key].x);
                    this.getAgents().get(key).setYCoord(agentsObject[key].y)
                }
            }
        })
    }

    updateGameObjects(gameObjectsObject) {
        // this is for when we add game objects that aren't agents
    }

    waitForAgentProperties() {
        this.getSocket().on("sentProperties", (data) => {
            console.log("properties recieved");
            this.getAgents().get(data.id).setProperties(data.properties)
        })
    }

    waitForServerUpdates() {
        this.getSocket().on("sentServerData", (data) => {
            this.updateAgents(data.agents);
            this.updateGameObjects(data.gameObject);
        })
    }

    static playGame(width, height) {
        const game = new AnimatedGame(width, height);
    }
}