import Agent from "./Agent.js";
import GameMap from './GameMap.js'
import AssetContainer from './AssetContainer.js';
import GameObject from "./GameObject.js";

/**
 * this class is abstract
 */
export default class AnimatedGame {
    // fields
    #width; // move to Display
    #height; // move to Display
    #canvas; // move to Display
    #ctx; // move to Display

    #gameState;
    #map;
    #miniMap; // move to Display
    #assetContainer; // move to Display
    #playerSpawnZone;
    #movementKeyLogger;
    #testingKeyLogger;
    #agents;
    #objects;
    #blocking;
    #player;
    #scale; // move to Display
    #socket; // move to ServerConnection

    #connection;
    #display;

    /**
     * initializes an AnimatedGame object
     * 
     * @param {Number} width - the width of the canvas
     * @param {Number} height - the height of the canvas
     */
    constructor(width, height) { // remove parameters? maybe the only parameter passed in should be the connection
        // takes parameters
        this.#width = width; // move to Display
        this.#height = height; // move to Display

        // creates a canvas with parameters, adds it to body
        this.#canvas = document.createElement('canvas'); // move to Display
        this.#canvas.id = "playSpace"; // move to Display
        document.body.appendChild(this.#canvas); // move to Display
        this.#canvas.width = width; // move to Display
        this.#canvas.height = height; // move to Display

        // creates context
        this.#ctx = this.#canvas.getContext('2d'); // move to Display

        // fields
        this.#gameState = "initialized";
        this.#map = null;
        this.#miniMap = null;
        this.#assetContainer = null; // move to Display
        this.#playerSpawnZone = null;
        this.#movementKeyLogger = null;
        this.#testingKeyLogger = null;
        this.#agents = new Map();
        this.#objects = new Map();
        this.#blocking = [];
        this.#player = null;
        this.#scale = 1; // move to Display

        this.#socket = io.connect(window.location.hostname); // move to ServerConnection
    }

    // standard getters and setters
    setWidth(newWidth) { // move to Display
        this.#width = newWidth;
    }
    getWidth() { // move to Display
        return this.#width;
    }
    setHeight(newHeight) { // move to Display
        this.#height = newHeight;
        this.#canvas.height = newHeight;
    }
    getHeight() { // move to Display
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
    setScale(scale) { // move to Display
        this.#scale = scale;
    }
    getScale() { // move to Display
        return this.#scale;
    }
    setMiniMap(newMiniMap) {
        this.#miniMap = newMiniMap;
    }
    getMiniMap() {
        return this.#miniMap;
    }
    getCTX() { // move to Display
        return this.#ctx;
    }
    setCanvas(newCanvas) { // move to Display
        this.#canvas = newCanvas;
        this.#ctx = newCanvas.getContext('2d');
    }
    getCanvas() { // move to Display
        return this.#canvas;
    }
    setAssetContainer(newAssetContainer) { // move to Display
        if (newAssetContainer instanceof AssetContainer) {
            this.#assetContainer = newAssetContainer;
        }
    }
    getAssetContainer() { // move to Display
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
    getSocket() { // move to Display
        return this.#socket;
    }
    setConnection(newConnection) {
        this.#connection = newConnection;
    }
    getConnection() {
        return this.#connection;
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
    updatePositionData() { // change name to updatePosition
        var change = this.interpretMovementKeys();
        if (change.x != 0 || change.y != 0) {
            this.getPlayer().move(change.x, change.y)
            this.getConnection().updatePosition(this.getPlayer());
            // var data = {
            //     id: this.getPlayer().getID(),
            //     x: this.getPlayer().getXCoord(),
            //     y: this.getPlayer().getYCoord()
            // }
            // this.getSocket().emit("playerMoved", data); // move to ServerConnection
        }
    }

    // requestServerData(initialRequest) { // move to ServerConnection
    //     this.getSocket().emit("requestServerData", initialRequest);
    // }

    // requestObjectProperties(id) { // move to ServerConnection
    //     var data = {
    //         id: id,
    //     }
    //     this.getSocket().emit("requestObjectProperties", data);
    // }

    // requestAgentProperties(id) { // move to ServerConnection
    //     var data = {
    //         id: id,
    //     }
    //     this.getSocket().emit("requestAgentProperties", data);
    // }

    // sendPlayerDataToServer() { // move to ServerConnection
    //     const player = this.getPlayer();
    //     var data = {
    //         id: player.getID(),
    //         x: player.getXCoord(),
    //         y: player.getYCoord(),
    //         properties: player.getProperties()
    //     }
    //     this.getSocket().emit("playerSpawned", data);
    // }

    // generatePlayerID() { // move to ServerConnection
    //     var data = {
    //         id: this.getPlayer().getID()
    //     }
    //     this.getSocket().emit("requestPlayerID", data)
    // }

    // /**
    //  * clears the whole play space of drawings
    //  */
    // clearPlaySpace(color) { // // move to Display and rename
    //     const ctx = this.getCTX();
    //     ctx.beginPath();
    //     ctx.rect(0, 0, this.getCanvas().width, this.getCanvas().height);
    //     ctx.fillStyle = color;
    //     ctx.fill();
    // }

    /**
     * draws all objects on the play space
     */
    drawObjects() { // move to Display
        this.getMiniMap().animate();
        this.getMap().draw(this.getScale());
        for (const key of this.getObjects().keys()) {
            this.getObjects().get(key).draw(this.getScale())
        }
        for (const key of this.getAgents().keys()) {
            this.getAgents().get(key).draw(this.getScale());
        }

    }

    adjustScale(scaleVar) { // move to Display
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

    // /**
    //  * draws a frame based on currently available data
    //  */
    // animateFrame() { // move to Display
    //     this.intrepretTestingKeys()
    //     this.updatePositionData();
    //     this.requestServerData(false);
    //     this.adjustScale();
    //     this.clearPlaySpace(this.getMap().getBackgroundColor()); // erase everything from the previous frame
    //     this.drawObjects(); // draw the objects
    // }

    // loadingScreenAnimation(counter) { // move to Display
    //     var counterMod = counter % 600
    //     var text = "loading"
    //     var textMod = Math.floor((counterMod % 200) / 50);
    //     while (textMod > 0) {
    //         text += " .";
    //         textMod--;
    //     }
    //     if (counterMod < 301) { // animations
    //         this.clearPlaySpace("white");
    //         const ctx = this.getCTX();
    //         const center = {
    //             x: this.getWidth() / 2,
    //             y: this.getHeight() / 2,
    //         }
    //         const radius = 200
    //         ctx.beginPath();
    //         ctx.arc(center.x,center.y, radius, 1.5 * Math.PI, (1.5 * Math.PI) + ((counterMod / 300) * 2 * Math.PI), false);
    //         ctx.lineWidth = 30;
    //         ctx.stroke();
    //         ctx.font = "50px Spectral";
    //         ctx.textAlign = "center";
    //         ctx.textBaseline = "middle";
    //         ctx.fillStyle = "black";
    //         ctx.fillText(text, center.x, center.y);
    //     } else {
    //         this.clearPlaySpace("white");
    //         const ctx = this.getCTX();
    //         const center = {
    //             x: this.getWidth() / 2,
    //             y: this.getHeight() / 2,
    //         }
    //         const radius = 200
    //         ctx.beginPath();
    //         ctx.arc(center.x,center.y, radius, (1.5 * Math.PI) + ((counterMod / 300) * 2 * Math.PI), 1.5 * Math.PI, false);
    //         ctx.lineWidth = 30;
    //         ctx.stroke();
    //         ctx.lineWidth = 30;
    //         ctx.stroke();
    //         ctx.font = "50px Spectral";
    //         ctx.textAlign = "center";
    //         ctx.textBaseline = "middle";
    //         ctx.fillStyle = "black";
    //         ctx.fillText(text, center.x, center.y);
    //     }
    // }
    
    // gameAnimationLoop() { // move to Display
    //     const game = this;
        
    //     function animationLoop() {
    //         game.animateFrame();
    //         if (game.getGameState() == "alive") {
    //             requestAnimationFrame(animationLoop);
    //         }
    //     }
    //     requestAnimationFrame(animationLoop);
    // }

    // loadingAnimationLoop() { // move to Display
    //     var counter = 0;

    //     const game = this;

    //     function animationLoop() {
    //         game.loadingScreenAnimation(counter);
    //         counter++;
    //         if (game.getGameState() == "loading") {
    //             requestAnimationFrame(animationLoop);
    //         }
    //     }
    //     requestAnimationFrame(animationLoop);
    // }

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

    // waitForObjectProperties() { // move to ServerConnection
    //     this.getSocket().on("sentObjectProperties", (data) => {
    //         console.log("properties for " + data.id + " recieved");
    //         this.getObjects().get(data.id).setProperties(data.properties);
    //         if (data.properties.opacity == GameObject.PROPERTIES.OPACITY.BLOCKING) {
    //             this.getBlocking().push(this.getObjects().get(data.id));
    //         }
    //     })
    // }

    // waitForAgentProperties() { // move to ServerConnection
    //     this.getSocket().on("sentAgentProperties", (data) => {
    //         console.log("properties for " + data.id + " recieved");
    //         console.log(data.properties)
    //         this.getAgents().get(data.id).setProperties(data.properties)
    //     })
    // }

    // waitForServerUpdates() { // move to ServerConnection
    //     this.getSocket().on("sentServerData", (data) => {
    //         this.updateAgents(data.agents);
    //         this.updateGameObjects(data.gameObjects);
    //     })
    // }

    // waitForPlayerID() { // move to ServerConnection
    //     this.getSocket().on("sentPlayerID", (combinedID) => {
    //         this.getAgents().delete(this.getPlayer().getID());
    //         this.getPlayer().setID(combinedID);
    //         this.getAgents().set(combinedID, this.getPlayer());
    //         this.sendPlayerDataToServer();
    //     });
    // }

    // waitForPlayerDisconnects() { // move to ServerConnection
    //     this.getSocket().on("playerDisconnected", (id) => {
    //         console.log("attempting to remove agent with ID: ", id)
    //         this.removeAgent(id);
    //     })
    // }

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