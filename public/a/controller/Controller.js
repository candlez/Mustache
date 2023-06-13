


export default class Controller {
    // fields
    #game;
    #display;

    #keyLoggers;

    constructor(game, display) {
        this.#game = game;
        this.#display = display;

        this.#keyLoggers = new Map();
    }



    activateKeyLogger(id) {
        this.#keyLoggers.get(id).listen();
    }



    deactivateKeyLogger(id) {
        this.#keyLoggers.get(id).stopListen();
    }



    interpretKeys() {
        new Error("abstract method called");
    }



    addKeyLogger(id, keyLogger) {
        if (this.#keyLoggers.has(id)) {
            new Error("attempted to add an existing key");
        } else {
            this.#keyLoggers.set(id, keyLogger);
        }
    }


    removeKeyLogger(id) {
        this.#keyLoggers.delete(id);
    }


    // getters and setters
    getGame() {
        return this.#game;
    }
    getDisplay() {
        return this.#display;
    }
    getKeyLoggers() {
        return this.#keyLoggers;
    }
}