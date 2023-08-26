const GameObject = require('./GameObject.cjs');

class Game {
    // private fields
    #io;
    #gameInfo;

    #players;
    #gameObjects;

    constructor(io, gameInfo) {
        this.#io = io;
        this.#gameInfo = gameInfo;

        this.#players = new Map();
        this.#gameObjects = new Map();
    }


    sendBack(message, data) { // to-do: implement this

    }


    addUser(socket) {
        socket.once("initializingGame", () => {
            this.#io.to(socket.id).emit("gameInfoSent", this.#gameInfo);
        });

        socket.once("requestingIds", () => {
            var ids = [];
            for (const id of this.#players.keys()) {
                ids.push(id);
            }
            for (const id of this.#gameObjects.keys()) {
                ids.push(id);
            }
            this.#io.to(socket.id).emit("idsSent", ids)
        });
    
    
        socket.on("requestingDataById", (id) => {
            if (this.#players.has(id)) {
                this.#io.to(socket.id).emit(id + "DataSent", this.#players.get(id).getArguments());
            } else if (gameObjects.has(id)) {
                this.#io.to(socket.id).emit(id + "DataSent", this.#gameObjects.get(id).getArguments());
            } else {
                // wah wah wah
            }
        });
    
    
        socket.once("requestingPlayerID", (data) => {
            var combinedID = data + "." + socket.id;
            this.#io.to(socket.id).emit("sentPlayerID", combinedID)
        });
    
    
        socket.on("playerSpawned", (data) => {
            this.#players.set(data.id, new GameObject(data.id, data.type, data.dynamic, data.x, data.y, data.args));
            // playerTimers.set(data.id, {timers: [], changed: false, codes: []}); // ewww
            // timers.changedTimeOut(playerTimers, data.id, "spawned");
            // socketToID.set(socket.id, data.id);
        });
    
    
        socket.on("playerMoved", (data) => {
            this.#players.get(data.id).x = data.x;
            this.#players.get(data.id).y = data.y;
            // timers.changedTimeOut(playerTimers, data.id, "moved")
        });
    
    
        socket.on("playerSizeChanged", (data) => {
            this.#players.get(data.id).size = data.size;
            // timers.changedTimeOut(playerTimers, data.id, "sizeChanged")
        });
    
        // to-do: re-implement this when the time is right

        // socket.on("requestingChanges", () => { // this needs to support more than one code
        //     // console.log("Marco")
        //     for (const entry of playerTimers.entries()) {
        //         var data = players.get(entry[0])
        //         if (entry[1].changed && entry[0] != socketToID.get(socket.id)) {
        //             // console.log(entry[1].codes);
        //             if (entry[1].codes.includes("spawned")) {
        //                 io.to(socket.id).emit("spawned", data);
        //             }
        //             if (entry[1].codes.includes("moved")) {
        //                 io.to(socket.id).emit("moved", {id: data.id, x: data.x, y: data.y});
        //             }
        //             if (entry[1].codes.includes("sizeChanged")) {
        //                 io.to(socket.id).emit("sizeChanged", {id: data.id, size: data.size});
        //             }
        //         }
        //     }
        // });
    
    
        // // review
        // socket.on("disconnect", (reason) => {
        //     console.log(socket.id + " has disconnected,reason: " + reason);
        //     // socket.broadcast.emit("playerDisconnected", socketToID.get(socket.id));
        //     socketToID.delete(socket.id);
        // });
    }


    removeUser(socket) {

    }
}

module.exports = Game;