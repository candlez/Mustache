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
        this.#gameState = "initialized";
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
    removeAgent(id) {
        this.getAgents().delete(id);
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

    requestServerData(initialRequest) {
        this.getSocket().emit("requestServerData", initialRequest);
    }

    requestAgentProperties(id) {
        var data = {
            id: id,
        }
        this.getSocket().emit("requestProperties", data);
    }

    sendPlayerDataToServer() {
        const player = this.getPlayer();
        var data = {
            id: player.getID(),
            x: player.getXCoord(),
            y: player.getYCoord(),
            properties: this.generateSpawnProperties(player.getColor())
        }
        this.getSocket().emit("playerSpawned", data);
    }

    generatePlayerID() {
        var data = {
            id: this.getPlayer().getID()
        }
        this.getSocket().emit("requestPlayerID", data)
    }

    /**
     * clears the whole play space of drawings
     */
    clearPlaySpace(color) {
        const ctx = this.getCTX();
        ctx.beginPath();
        ctx.rect(0, 0, this.getCanvas().width, this.getCanvas().height);
        ctx.fillStyle = color;
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

    adjustScale() {

    }

    /**
     * draws a frame based on currently available data
     */
    animateFrame() {
        this.updatePositionData();
        this.requestServerData(false);
        this.adjustScale();
        this.clearPlaySpace(this.getMap().getBackgroundColor()); // erase everything from the previous frame
        this.drawObjects(); // draw the objects
    }

    loadingScreenAnimation(counter) {
        var counterMod = counter % 600
        var text = "loading"
        var textMod = Math.floor((counterMod % 200) / 50);
        while (textMod > 0) {
            text += " .";
            textMod--;
        }
        if (counterMod < 301) { // animations
            this.clearPlaySpace("white");
            const ctx = this.getCTX();
            const center = {
                x: this.getWidth() / 2,
                y: this.getHeight() / 2,
            }
            const radius = 200
            ctx.beginPath();
            ctx.arc(center.x,center.y, radius, 1.5 * Math.PI, (1.5 * Math.PI) + ((counterMod / 300) * 2 * Math.PI), false);
            ctx.lineWidth = 30;
            ctx.stroke();
            ctx.font = "50px Spectral";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.fillText(text, center.x, center.y);
        } else {
            this.clearPlaySpace("white");
            const ctx = this.getCTX();
            const center = {
                x: this.getWidth() / 2,
                y: this.getHeight() / 2,
            }
            const radius = 200
            ctx.beginPath();
            ctx.arc(center.x,center.y, radius, (1.5 * Math.PI) + ((counterMod / 300) * 2 * Math.PI), 1.5 * Math.PI, false);
            ctx.lineWidth = 30;
            ctx.stroke();
            ctx.lineWidth = 30;
            ctx.stroke();
            ctx.font = "50px Spectral";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.fillText(text, center.x, center.y);
        }
    }
    
    gameAnimationLoop() {
        const game = this;

        function animationLoop() {
            game.animateFrame();
            if (game.getGameState() == "alive") {
                requestAnimationFrame(animationLoop);
            }
        }
        requestAnimationFrame(animationLoop);
    }

    loadingAnimationLoop() {
        var counter = 0;

        const game = this;

        function animationLoop() {
            game.loadingScreenAnimation(counter);
            counter++;
            if (game.getGameState() == "loading") {
                requestAnimationFrame(animationLoop);
            }
        }
        requestAnimationFrame(animationLoop);
    }

    beginLoading() {
        this.setGameState("loading");
        this.loadingAnimationLoop();
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

    addAgentFromData(key, agent) {
        this.requestAgentProperties(key);
        this.addAgent(new Agent(key, this.getGame(), false, agent.x, agent.y, { // properties (no animation style)
            animation: {
                type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE
            },
            opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE
        }))
    }

    updateAgentFromData(key, agent) {
        this.getAgents().get(key).setXCoord(agent.x);
        this.getAgents().get(key).setYCoord(agent.y);
    }

    updateAgents(agentsObject) {
        agentsObject.keys.forEach((key) => {
            if (this.getAgents().get(key) == null) {
                if (agentsObject[key].state == "alive") {
                    this.addAgentFromData(key, agentsObject[key])
                    this.requestAgentProperties(key)
                }
            } else {
                if (agentsObject[key].state == "alive" && key != this.getPlayer().getID()) {
                    this.updateAgentFromData(key, agentsObject[key])
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

    waitForPlayerID() {
        this.getSocket().on("sentPlayerID", (combinedID) => {
            this.getAgents().delete(this.getPlayer().getID());
            this.getPlayer().setID(combinedID);
            this.getAgents().set(combinedID, this.getPlayer());
            this.sendPlayerDataToServer();
        });
    }

    waitForPlayerDisconnects() {
        this.getSocket().on("playerDisconnected", (id) => {
            console.log("attempting to remove agent with ID: ", id)
            this.removeAgent(id);
        })
    }

    generateSpawnProperties() {
        return {
            opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
            animation: {
                type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE,
            }
        };
    }

    spawnPlayer(id) {
        var spawnCoords = this.getPlayerSpawnZone().generateSpawnCoords();
        var newAgent = new Agent(id, this, true, spawnCoords.x, spawnCoords.y, this.generateSpawnProperties())
        this.addAgent(newAgent);
    }

    startGame() {
        this.setGameState("alive");
        this.getMiniMap().showContainer();
        this.getMovementKeyLogger().startWASD();
        this.gameAnimationLoop();
    }

    static playGame(width, height) {
        const game = new AnimatedGame(width, height);
    }
}