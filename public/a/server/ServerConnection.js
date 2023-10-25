import Game from './../model/Game.js'
import Square from '../model/Square.js';
import GridAnimation from '../view/animations/game_objects/GridAnimation.js';
import Interpolator from "./../model/Interpolator.js";

export default class ServerConnection {
    // fields
    #socket;

    #game;
    #display;
    #controller;

    #latency;
    #interpolator;

    #sending;


    constructor(domain) {
        this.#socket = io.connect(domain);
        this.#sending = true; // temporary

        this.#socket.on("test", (data) => { // temp
            console.log(data);
        });
    }


    initializeGame() {
        return new Promise((resolve, reject) => {
            this.#socket.once("gameInfoSent", (data) => {
                this.#game = new Game(Date.now() - data.timeStamp, data.info.width);
                // hard-coded values, which can be recieved from the server in the future
                this.#game.addBackgroundAnimation(new GridAnimation(data.info.width, data.info.width, 100, "gray"));
                this.#interpolator = new Interpolator(this.#game);
                this.#latency = 100;
                resolve();
            });

            this.#socket.emit("initializingGame");
        });
    }


    addInitialDataToGame() {
        return new Promise((resolve, reject) => {
            this.#socket.on("initialDataSent", (data) => {
                this.#game.addObjectBasedOnData(data);
            });

            this.#socket.once("finishedSendingData", () => {
                this.#socket.off("initialDataSent");
                resolve();
            });

            this.#socket.emit("requestingInitialData")
        });
    }



    setUpListeners() {
        this.waitForChanges();
    }



    spawnPlayer(name, color) {
        return new Promise((resolve, reject) => {
            this.#socket.once("sentPlayerID", (data) => {
                const player = this.#game.spawnPlayer(data, color);
                console.log(player); // temp

                this.#socket.emit("playerSpawned", {
                    data: {
                        id: player.getID(),
                        type: "square",
                        dynamic: true,
                        x: player.getXCoord(),
                        y: player.getYCoord(),
                        vectors: player.getVectors(),
                        args: {
                            size: player.getSize(),
                            color: player.getColor()
                        }
                    },
                    timeStamp: this.#game.getGameTime()
                });
                resolve();
            });
            this.#socket.emit("requestingPlayerID", name);
        })
    }


    // deprecated
    emitMoved() {
        const player = this.#game.getPlayer();
        this.#socket.emit("playerMoved", {
            id: player.getID(),
            x: player.getXCoord(),
            y: player.getYCoord()
        })
    }


    emitSizeChanged(deltaSize) {
        const player = this.#game.getPlayer();
        this.#socket.emit("playerSizeChanged", {
            id: player.getID(),
            data: {
                deltaSize: deltaSize
            },
            timeStamp: this.#game.getGameTime()
        });
    }


    emitVectorsChanged(deltaVectors) {
        const player = this.#game.getPlayer();
        this.#socket.emit("playerVectorsChanged", {
            id: player.getID(),
            data: {
                deltaVectors: deltaVectors,
                x: player.getXCoord(),
                y: player.getYCoord()
            },
            timeStamp: this.#game.getGameTime()
        });
    }


    // deprecated
    waitForChanges() {
        this.#socket.on("batchSent", (batch) => {
            this.#interpolator.loadBatch(batch);
        });
    }


    updateGame() {
        this.#interpolator.unloadChanges(this.#game.getGameTime() - this.#latency);
    }


    // getters
    getSocket() {
        return this.#socket;
    }
    getGame() {
        return this.#game;
    }
    getDisplay() {
        return this.#display;
    }
    getInterpolator() {
        return this.#interpolator;
    }

    // setters
    setDisplay(newDisplay) {
        this.#display = newDisplay;
    }


    // temp
    isSending() {
        return this.#sending;
    }
    setSending(newSending) {
        this.#sending = newSending;
    }
}