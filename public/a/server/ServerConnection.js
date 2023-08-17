import Game from './../model/Game.js'
import Square from '../model/Square.js';

export default class ServerConnection {
    // fields
    #socket;

    #game;
    #display;
    #controller;


    constructor(domain /*, game, display, controller*/) {
        this.#socket = io.connect(domain);
        // this.#game = game;
        // this.#display = display;
        // this.#controller = controller;


    }


    addObjectBasedOnData(data) { // this is RazorRoyaleSpecific
        var obj;
        if (data.type == "square") {
            obj = new Square(data.id, data.x, data.y, data.size, data.color);

        } else {
            console.log("not a square!")
        }

        if (obj !== undefined) {
            if (data.dynamic) {
                console.log(data.x, data.y)
                this.#game.insertDynamic(obj);
            } else {
                this.#game.insertStatic(obj);
            }
        }
    }


    initializeGame() { // this name sucks
        return new Promise((resolve, reject) => {
            const socket = this; // why isn't this being used?
            this.#socket.once("gameConstructorValuesSent", (data) => {
                this.#game = new Game(data);
                resolve();
            });
    
            this.#socket.emit("initializingGame");
        });
    }


    addInitialDataToGame() {
        return new Promise((resolve, reject) => {
            this.#socket.once("idsSent", (data) => {
                var promises = data.map((id) => {
                    return new Promise((resolve, reject) => {
                        this.#socket.once(id + "DataSent", (data) => {
                            resolve(data);
                        })

                        this.#socket.emit("requestingDataById", id);
                    });
                });

                Promise.all(promises).then((data) => {
                    for (var i = 0; i < data.length; i++) {
                        this.addObjectBasedOnData(data[i]);
                    }
                    resolve();
                });
            });


            this.#socket.emit("requestingIds")
        });
    }



    setUpListeners() {
        this.waitForChanges();
    }



    spawnPlayer(name, color) {
        return new Promise((resolve, reject) => {
            this.#socket.once("sentPlayerID", (data) => {
                const player = this.#game.spawnPlayer(data, color);

                this.#socket.emit("playerSpawned", {
                    id: player.getID(),
                    type: "square",
                    dynamic: true,
                    x: player.getXCoord(),
                    y: player.getYCoord(),
                    size: player.getSize(),
                    color: player.getColor()
                });
                resolve();
            });
            this.#socket.emit("requestingPlayerID", name);
        })
    }


    emitMoved() { // could change these to accept a GameObject as an argument
        const player = this.#game.getPlayer();
        this.#socket.emit("playerMoved", {
            id: player.getID(),
            x: player.getXCoord(),
            y: player.getYCoord()
        })
    }


    emitSizeChanged() {
        const player = this.#game.getPlayer();
        this.#socket.emit("playerSizeChanged", {
            id: player.getID(),
            size: player.getSize()
        });
    }


    requestChanges() {
        this.#socket.emit("requestingChanges");
    }


    waitForChanges() {
        this.#socket.on("spawned", (data) => {
            console.log(data.x, data.y);
            this.addObjectBasedOnData(data);
        });
        this.#socket.on("moved", (data) => {
            console.log(data.x, data.y);
            this.#game.moveDynamic(data.id, data.x, data.y);
        });
        this.#socket.on("sizeChanged", (data) => {
            console.log("hello")
            this.#game.changeObjectSize(data.id, data.size);
            // if (data.dynamic) {
            //     this.#game.changeObjectSize(data.id, data.size);
            // } else {
            //     new Error("size of static objects cannot be changed")
            // }
        })
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

    // setters
    setDisplay(newDisplay) {
        this.#display = newDisplay;
    }
}