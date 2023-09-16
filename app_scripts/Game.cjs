const GameObject = require('./GameObject.cjs');
const DynamicGameObject = require('./DynamicGameObject.cjs');
const Changed = require('./Changed.cjs');

class Game {
    // private fields
    #io;
    #gameInfo;

    #players;
    #gameObjects;

    #changed;

    #socketToID;

    constructor(io, gameInfo) {
        this.#io = io;
        this.#gameInfo = gameInfo;

        this.#players = new Map();
        this.#gameObjects = new Map();

        this.#changed = new Set();

        this.#socketToID = new Map();
    }


    sendBack(socketID, message, data) {
        if (data === undefined) {
            this.#io.to(socketID).emit(message);
        } else {
            this.#io.to(socketID).emit(message, data);
        }
    }


    addGameObject(gameObject) {
        this.#gameObjects.set(gameObject.id, gameObject);
    }


    addUser(socket) {
        socket.once("initializingGame", () => {
            this.sendBack(socket.id, "gameInfoSent", this.#gameInfo);
        });

        socket.once("requestingIds", () => {
            var ids = [];
            for (const id of this.#players.keys()) {
                ids.push(id);
            }
            for (const id of this.#gameObjects.keys()) {
                ids.push(id);
            }
            this.sendBack(socket.id, "idsSent", ids);
        });
    

         // is it a problem that this means no name overlap?
         // answer: no because there would never be any overlap
         //         all player IDs have socket IDs appended to them
         //         while GameObject IDs would not
        socket.on("requestingDataById", (id) => {
            if (this.#players.has(id)) {
                this.sendBack(socket.id, id + "DataSent", this.#players.get(id).getArguments())
            } else if (this.#gameObjects.has(id)) {
                this.sendBack(socket.id, id + "DataSent", this.#gameObjects.get(id).getArguments())
            } else {
                console.log(id + " not found")
            }
        });
    
    
        socket.once("requestingPlayerID", (enteredID) => {
            this.sendBack(socket.id, "sentPlayerID", enteredID + "." + socket.id);
        });
    
    
        socket.on("playerSpawned", (data) => {
            this.#socketToID.set(socket.id, data.id);

            const player = new DynamicGameObject(data.id, data.type, data.dynamic, 
                data.x, data.y, data.vectors, data.args);
            
            player.changed.addChange(Changed.CODES.SPAWNED);
            this.#players.set(data.id, player);
            this.#changed.add(data.id);
        });
    
    
        socket.on("playerMoved", (data) => {
            const player = this.#players.get(data.id);
            player.x = data.x;
            player.y = data.y;
            player.changed.addChange(Changed.CODES.MOVED);
            this.#changed.add(data.id);
        });
    
    
        socket.on("playerSizeChanged", (data) => {
            const player = this.#players.get(data.id);
            player.size = data.size;
            player.changed.addChange(Changed.CODES.SIZE_CHANGED);
            this.#changed.add(data.id);
        });


        socket.on("playerVectorsChanged", (data) => {
            const player = this.#players.get(data.id);
            player.vectors = data.vectors;
            player.x = data.x;
            player.y = data.y;
            player.changed.addChange(Changed.CODES.VECTORS_CHANGED);
            this.#changed.add(data.id);
        });
    
        
        socket.on("requestingChanges", () => {
            // console.log("Marco")

            for (const id of this.#changed.values()) {
                // console.log(player)
                if (id != this.#socketToID.get(socket.id)) {
                    const player = this.#players.get(id);
                    if (player.changed.getChanged()) {
                        if (player.changed.getSpawned()) {
                            this.sendBack(socket.id, "spawned", player.getArguments());
                        } else {
                            if (player.changed.getSizeChanged()) {
                                this.sendBack(socket.id, "sizeChanged", {id: player.id, size: player.size});
                            }
                            if (player.changed.getVectorsChanged()) {
                                this.sendBack(socket.id, "vectorsChanged", {
                                    id: player.id, 
                                    vectors: player.vectors,
                                    x: player.x,
                                    y: player.y
                                });
                            }
                            if (player.changed.getMoved()) { // deprecated
                                this.sendBack(socket.id, "moved", {id: player.id, x: player.x, y: player.y});
                            }
                        }
                    } else {
                        this.#changed.delete(id);
                    }
                }
            }
            this.sendBack(socket.id, "changesSent")
        });
    
    
        // // review
        // socket.on("disconnect", (reason) => {
        //     console.log(socket.id + " has disconnected,reason: " + reason);
        //     // socket.broadcast.emit("playerDisconnected", socketToID.get(socket.id));
        //     socketToID.delete(socket.id);
        // });
    }
}

module.exports = Game;