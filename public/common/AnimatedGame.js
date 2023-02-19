import Agent from "./Agent.js";
import GameMap from './GameMap.js'
import AssetContainer from './AssetContainer.js';
import GameObject from "./GameObject.js";

/**
 * this class is abstract
 */
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
    #testingKeyLogger;
    #agents;
    #objects;
    #blocking;
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
        this.#testingKeyLogger = null;
        this.#agents = new Map();
        this.#objects = new Map();
        this.#blocking = [];
        this.#player = null;
        this.#scale = 1;

        this.#socket = io.connect(window.location.hostname);
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
    getBlocking() {
        return this.#blocking;
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
    setTestingKeyLogger(newTestingKeyLogger) {
        this.#testingKeyLogger = newTestingKeyLogger;
    }
    getTestingKeyLogger() {
        return this.#testingKeyLogger;
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
        else if (agent.getOpacity() == GameObject.PROPERTIES.OPACITY.BLOCKING) {
            this.getBlocking().push(agent);
        }
    }

    /**
     * removes all the Agents with a given id
     * 
     * @param id - string that identifies the agents to be removed
     */
    removeAgent(id) {
        if (this.getAgents().get(id).getOpacity() == 1) {
            this.removeFromBlocking(id);
        }
        this.getAgents().delete(id);
    }

    addObject(object) {
        if (object instanceof GameObject) {
            this.#objects.set(object.getID(), object);
        }
        if (object.getOpacity() == GameObject.PROPERTIES.OPACITY.BLOCKING) {
            console.log(object)
            this.getBlocking().push(object);
        }
    }

    removeObject(id) {
        if (this.getObjects().get(id).getOpacity() == 1) {
            this.removeFromBlocking(id);
        }
        this.getObjects().delete(id);
    }

    removeFromBlocking(id) {
        for (var i = this.getBlocking().length - 1; i >= 0 ; i--) {
            if (this.getBlocking()[i].getID() == id) {
                this.getBlocking().splice(i, 1);
            }
        }
    }

    /**
     * calculates the change to x and y values of objects being moved
     */
    interpretMovementKeys() {
        const loggers = this.getMovementKeyLogger().getKeyLoggers();
        const unitVectors = [
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

    intrepretTestingKeys() {
        const loggers = this.getTestingKeyLogger().getKeyLoggers();
        if (loggers.get("9").getKeyDown()) {
            console.log("9 was pressed");
        }
        if (loggers.get("8").getKeyDown()) {
            console.log("8 was pressed");
        }
        if (loggers.get("7").getKeyDown()) {
            console.log("7 was pressed");
        }
        if (loggers.get("6").getKeyDown()) {
            console.log("6 was pressed");
        }
        if (loggers.get("5").getKeyDown()) {
            console.log("5 was pressed");
        }
    }

    /**
     * updates posiiton data so the objects can be drawn
     * 
     * also updates scale data
     */
    updatePositionData() {
        var change = this.interpretMovementKeys();
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

    requestObjectProperties(id) {
        var data = {
            id: id,
        }
        this.getSocket().emit("requestObjectProperties", data);
    }

    requestAgentProperties(id) {
        var data = {
            id: id,
        }
        this.getSocket().emit("requestAgentProperties", data);
    }

    sendPlayerDataToServer() {
        const player = this.getPlayer();
        var data = {
            id: player.getID(),
            x: player.getXCoord(),
            y: player.getYCoord(),
            properties: player.getProperties()
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
    getPageDimensions() { // what is this for?
        return [window.innerWidth, window.innerHeight];
    }

    /**
     * draws all objects on the play space
     */
    drawObjects() {
        this.getMiniMap().animate();
        this.getMap().draw(this.getScale());
        for (const key of this.getObjects().keys()) {
            this.getObjects().get(key).draw(this.getScale())
        }
        for (const key of this.getAgents().keys()) {
            this.getAgents().get(key).draw(this.getScale());
        }

    }

    adjustScale(scaleVar) {
        var rate = .05
        if (scaleVar * this.getScale() > 100) {
            var targetScale = Math.round((100 / scaleVar) * 1000) / 1000;
            var diff = this.getScale() - targetScale;
            this.setScale(Math.round((this.getScale() - (diff * rate)) * 1000) / 1000);
        } else if (scaleVar * this.getScale() < 100) {
            var targetScale = Math.round((100 / scaleVar) * 1000) / 1000;
            var diff = targetScale - this.getScale();
            this.setScale(Math.round((this.getScale() + (diff * rate)) * 1000) / 1000);
        }
    }

    /**
     * draws a frame based on currently available data
     */
    animateFrame() {
        // console.log(this.getBlocking())
        this.intrepretTestingKeys()
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

    pointValidation(xCoord, yCoord) {
        if (this.getMap().isOutOfBounds(xCoord, yCoord)) {
            throw new RangeError("out of bounds", {cause: this.getMap().getBounds()})
        }
        this.getBlocking().forEach((blockingObject) => {
            if (blockingObject.isPointWithinBounds(xCoord, yCoord)) {
                throw new RangeError("hit blocking object", {cause: blockingObject.getBounds()});
            }
        })
    }

    /**
     * abstract
     */
    addObjectFromData() {
        throw new Error("addObjectFromData is an abstract method and should not be called");
    }

    /**
     * abstract
     */
    addAgentFromData() {
        throw new Error("addAgentFromData is an abstract method and should not be called")
    }

    updateObjectFromData(key, object) {
        this.getObjects().get(key).setXCoord(object.x);
        this.getObjects().get(key).setYCoord(object.y);
    }

    updateAgentFromData(key, agent) {
        this.getAgents().get(key).setXCoord(agent.x);
        this.getAgents().get(key).setYCoord(agent.y);
    }

    updateGameObjects(gameObjectsObject) {
        gameObjectsObject.keys.forEach((key) => {
            if (this.getObjects().get(key) == null) {
                this.addObjectFromData(key, gameObjectsObject[key]);
            } else {
                if (gameObjectsObject[key].state == "alive") {
                    this.updateObjectFromData(key, gameObjectsObject[key])
                }
            }
        })
    }

    updateAgents(agentsObject) {
        agentsObject.keys.forEach((key) => {
            if (this.getAgents().get(key) == null) {
                if (agentsObject[key].state == "alive") {
                    this.addAgentFromData(key, agentsObject[key]);
                }
            } else {
                if (agentsObject[key].state == "alive" && key != this.getPlayer().getID()) {
                    this.updateAgentFromData(key, agentsObject[key])
                }
            }
        })
    }

    waitForObjectProperties() {
        this.getSocket().on("sentObjectProperties", (data) => {
            console.log("properties for " + data.id + " recieved");
            this.getObjects().get(data.id).setProperties(data.properties)
        })
    }

    waitForAgentProperties() {
        this.getSocket().on("sentAgentProperties", (data) => {
            console.log("properties for " + data.id + " recieved");
            console.log(data.properties)
            this.getAgents().get(data.id).setProperties(data.properties)
        })
    }

    waitForServerUpdates() {
        this.getSocket().on("sentServerData", (data) => {
            this.updateAgents(data.agents);
            this.updateGameObjects(data.gameObjects);
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

    generateSpawnProperties() { // remove this
        return {
            opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
            animation: {
                type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE,
            }
        };
    }

    /**
     * abstract
     */
    spawnPlayer() {
        throw new Error("spawnPlayer is an abstract method and should not be called")
    }

    startGame() {
        this.setGameState("alive");
        this.getMiniMap().showContainer();
        this.getMovementKeyLogger().startWASD();
        this.getTestingKeyLogger().startTestKeys();
        this.gameAnimationLoop();
    }

    /**
     * abstract
     */
    static playGame() {
        throw new Error("playGame is an abstract method and should not be called")
    }
}