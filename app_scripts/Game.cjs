const GameObject = require('./GameObject.cjs');
const DynamicGameObject = require('./DynamicGameObject.cjs');
const Batch = require("./Batch.cjs");
const Change = require("./Change.cjs");
const BatchLog = require("./BatchLog.cjs");

class Game {
    // private fields
    #io;
    #gameInfo;
    #isActive;

    #players;
    #gameObjects;

    // how long should changes be stored for?
    static LOG_LENGTH = 100;
    static BATCH_LENGTH = 100;
    #currentBatch;
    #previousBatch;
    #deadline;
    #timeStamp;
    #zero;

    #batchLog;
    #tardy;

    #socketToID;

    constructor(io, gameInfo) {
        this.#io = io;
        this.#gameInfo = gameInfo;
        this.#isActive = false;

        this.#players = new Map();
        this.#gameObjects = new Map();

        this.#batchLog = new BatchLog(Game.LOG_LENGTH);
        this.#tardy = new Map();

        this.#socketToID = new Map();

        this.#zero = Date.now();
    }


    getGameTime() {
        return Date.now() - this.#zero;
    }


    addUser(socket) {
        this.test(socket.id);

        socket.once("initializingGame", () => {
            this.sendBack(socket.id, "gameInfoSent", {
                info: this.#gameInfo,
                timeStamp: this.getGameTime()
            });
        });


        socket.once("requestingInitialData", () => {
            for (const player of this.#players.values()) {
                this.sendBack(socket.id, "initialDataSent", {
                    args: player.getArguments(),
                    timeStamp: this.#timeStamp
                });
            }
            for (const obj of this.#gameObjects.values()) {
                this.sendBack(socket.id, "initialDataSent", {
                    args: obj.getArguments()
                });
            }
            this.sendBack(socket.id, "finishedSendingData");
        });
    
    
        socket.once("requestingPlayerID", (enteredID) => {
            this.sendBack(socket.id, "sentPlayerID", enteredID + "." + socket.id);
        });
    
    
        socket.on("playerSpawned", (data) => {
            this.receiveChange(
                new Change(data.data.id, Change.CODES.SPAWNED, data.data, data.timeStamp, data.data.id),
                socket.id
            );
            this.#socketToID.set(socket.id, data.data.id);
        });
    
        // double deprecated
        socket.on("playerMoved", (data) => {
            console.log("Recieved Player Moved Code??");
        });
    
    
        socket.on("playerSizeChanged", (data) => {
            this.receiveChange(new Change(data.id, Change.CODES.SIZE_CHANGED, data.data, data.timeStamp, data.id), socket.id);
        });


        socket.on("playerVectorsChanged", (data) => {
            this.receiveChange(new Change(data.id, Change.CODES.VECTORS_CHANGED, data.data, data.timeStamp, data.id), socket.id);
        });


        socket.on("reconciled", (id) => {
            if (this.#tardy.has(id)) {
                if (this.#tardy.get(id) == 1) {
                    this.#tardy.delete(id);
                } else {
                    this.#tardy.set(id, this.#tardy.get(id) - 1);
                }
            } else {
                console.log("Trying to Reconcile Non-Tardy Object: ", id);
            }
        });
    
        // leaving is going to be a type of change in the new system
        // of course this is going to stay, it's just going to be merged
        // into the change system

        socket.on("disconnect", (reason) => {
            console.log(socket.id + " has disconnected, reason: " + reason);
            this.#currentBatch.insertChange(new Change(
                this.#socketToID.get(socket.id), 
                Change.CODES.DISCONNECTED, 
                {}, 
                this.getGameTime(),
                this.#socketToID.get(socket.id)
            ));
            this.#socketToID.delete(socket.id);
        });
    }


    start() {
        this.#isActive = true;
        this.batchCycle();
    }


    batchCycle(first) {
        // make a new batch
        var start = this.getGameTime();
        this.#currentBatch = new Batch(start, start + Game.BATCH_LENGTH);

        if (first) {
            this.#deadline = this.#currentBatch.getStart();
        } else {
            this.#deadline += Game.BATCH_LENGTH / 2;
        }

        // wait until batch length has elapsed
        setTimeout(() => {
            // cycle backwards
            if (this.#previousBatch) {
                this.#batchLog.addBatch(this.#previousBatch);
                setTimeout(() => {
                    // this order works because this will happen in the future
                    this.#io.emit("batchSent", this.#previousBatch.convertToData());

                    this.#deadline = this.#currentBatch.getStart();

                    const changes = this.#previousBatch.toArray();
                    for (var i = 0; i < changes.length; i++) {
                        this.enactChange(changes[i]);
                    }

                    this.#timeStamp = this.#currentBatch.getStart();
                }, Game.BATCH_LENGTH / 2);  
            }
            this.#previousBatch = this.#currentBatch;

            // repeat
            if (this.#isActive) {
                this.batchCycle(false);
            }
        }, Game.BATCH_LENGTH);
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


    receiveChange(change, socketID) {
        if (this.#tardy.has(change.id)) {
            change = this.adjustChange(change);
        }

        if (change.timeStamp > this.#currentBatch.getEnd()) {
            // invalid timestamp (in the future)
            console.log("TimeStamp Recieved From the Future: ", 
                change.timeStamp, this.getGameTime(), this.#currentBatch.getEnd());
        } else if (change.timeStamp > this.#currentBatch.getStart()) {
            this.#currentBatch.insertChange(change);
        } else if (change.timeStamp > this.#deadline) {
            this.#previousBatch.insertChange(change);
        } else {
            // invalid timestamp (too far in the past)
            // enter into reconcilation logic
            console.log("TimeStamp Received Past Deadline: ", change.timeStamp, this.getGameTime(), this.#deadline);
            console.log(change);
            this.reconcileChange(change, socketID);
        }
    }


    reconcileChange(change, socketID) {
        var batch;
        if (this.#deadline == this.#currentBatch.getStart()) {
            batch = this.#currentBatch;
        } else {
            batch = this.#previousBatch;
        }
        if (this.#tardy.has(change.id)) {
            this.#tardy.set(change.id, this.#tardy.get(change.id) + 1);
        } else {
            this.#tardy.set(change.id, 1);
        }

        switch (change.code) {
            case Change.CODES.SPAWNED:
                // we'll deal with this one later!
                break;
            case Change.CODES.VECTORS_CHANGED:
                var diff = this.#deadline - change.timeStamp;

                change.timeStamp = this.#deadline;
                batch.insertChange(change);

                this.sendBack(socketID, "reconciliation", {
                    code: change.code,
                    data: {
                        deltaX: -.001 * diff * change.data.deltaVectors[0],
                        deltaY: -.001 * diff * change.data.deltaVectors[1]
                    },
                    timeStamp: this.#deadline
                });
                break;
            case Change.CODES.SIZE_CHANGED:
                change.timeStamp = this.#deadline;
                batch.insertChange(change);
                break;
            default:
                // oopsies!

        }
    }


    enactChange(change) {
        const player = this.#players.get(change.id);
        switch(change.code) {
            case Change.CODES.SPAWNED:
                // update the server data to reflect this change
                const newPlayer = new DynamicGameObject(change.id, change.data.type, change.data.dynamic, 
                    change.data.x, change.data.y, change.data.vectors, change.data.args
                );
                this.#players.set(change.id, newPlayer);
                break;
            case Change.CODES.VECTORS_CHANGED:
                // vectors now represent per second speed
                // calculating an agents particular position at a given time can be done (sort of)
                // the main problem is that this treats movement like it's continuous rather than discrete
                // I think if we add a sort of buffer then this will be an acceptable trade-off
                player.vectors[0] += change.data.deltaVectors[0];
                player.vectors[1] += change.data.deltaVectors[1];
                player.lastVectorChange = change.timeStamp;
                if (change.data.x == "ignore") break;
                player.x = change.data.x;
                player.y = change.data.y;
                break;
            case Change.CODES.SIZE_CHANGED:
                player.size += change.data.deltaSize;
                break;
            case Change.CODES.DISCONNECTED:
                this.#players.delete(change.id);
                break;
            default:
                // invalid code
                console.log("Change with INVALID CODE: ", change);
        }
    }


    adjustChange(change) {
        switch(change.code) {
            case Change.CODES.VECTORS_CHANGED:
                change.data.x = "ignore";
                break;
            default:
                console.log("Adjusting Change With Bad Code: ", change);
        }
        return change;
    }
 

    test(id) { // temporary?
        // var batch = new Batch(0, 1000);
        // for (var i = 0; i < 1000; i++) {
        //     batch.insertChange(new Change(i.toString(), 1, {x: 100, y: 1000}, i));
        // }
        // this.sendBack(id, "test", batch.convertToData());
    }


    // getters
    isActive() {
        return this.#isActive;
    }
}

module.exports = Game;