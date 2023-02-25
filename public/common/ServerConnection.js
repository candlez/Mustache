

export default class ServerConnection {
    // fields
    #socket;

    #game;
    #display;

    constructor(socket) {
        this.#socket = socket;
    }

    // getters and setters
    getSocket() {
        return this.#socket;
    }
    setGame(newGame) {
        this.#game = newGame;
    }
    getGame() {
        return this.#game;
    }
    getDisplay() {
        return this.#display;
    }


    // methods
    requestServerData(initialRequest) {
        this.getSocket().emit("requestServerData", initialRequest);
    }

    requestAgentProperties(id) { // change to just sending the id (no object)
        var data = {
            id: id,
        }
        this.getSocket().emit("requestAgentProperties", data);
    }

    requestObjectProperties(id) { // change to just sending the id (no object)
        var data = {
            id: id,
        }
        this.getSocket().emit("requestObjectProperties", data);
    }

    sendPlayerDataToServer(player) { // rename?
        this.getSocket().emit("playerSpawned", {
            id: player.getID(),
            x: player.getXCoord(),
            y: player.getYCoord(),
            properties: player.getProperties()
        });
    }

    generatePlayerID() { // change to just sending the id (no object)
        var data = {
            id: this.getPlayer().getID()
        }
        this.getSocket().emit("requestPlayerID", data)
    }

    updatePosition(player) {
        this.getSocket().emit("playerMoved", {
            id: player.getID(),
            x: player.getXCoord(),
            y: player.getYCoord()
        });
    }

    // waiting methods
    waitForObjectProperties() { // fix for new scope
        this.getSocket().on("sentObjectProperties", (data) => {
            console.log("properties for " + data.id + " recieved");
            this.getObjects().get(data.id).setProperties(data.properties);
            if (data.properties.opacity == GameObject.PROPERTIES.OPACITY.BLOCKING) {
                this.getBlocking().push(this.getObjects().get(data.id));
            }
        })
    }

    waitForAgentProperties() { // fix for new scope
        this.getSocket().on("sentAgentProperties", (data) => {
            console.log("properties for " + data.id + " recieved");
            console.log(data.properties)
            this.getAgents().get(data.id).setProperties(data.properties)
        })
    }

    waitForServerUpdates() { // fix for new scope
        this.getSocket().on("sentServerData", (data) => {
            this.updateAgents(data.agents);
            this.updateGameObjects(data.gameObjects);
        })
    }

    waitForPlayerID() { // fix for new scope
        this.getSocket().on("sentPlayerID", (combinedID) => { // change to once
            this.getAgents().delete(this.getPlayer().getID());
            this.getPlayer().setID(combinedID);
            this.getAgents().set(combinedID, this.getPlayer());
            this.sendPlayerDataToServer();
        });
    }

    waitForPlayerDisconnects() { // fix for new scope
        this.getSocket().on("playerDisconnected", (id) => {
            console.log("attempting to remove agent with ID: ", id)
            this.removeAgent(id);
        })
    }


    waitForStartGame() {
        throw new Error("this method is abstract and shouldn't be called!");
    }
}