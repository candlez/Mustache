import KeyLogger from "./KeyLogger.js";

/**
 * 
 */
export default class MovementKeyLogger {
    // fields
    #keyLoggers;

    /**
     * 
     */
    constructor() {
        this.#keyLoggers = new Map();
    }

    // methods
    addKeyLogger(key) {
        this.getKeyLoggers().set(key, new KeyLogger(key));
    }

    removeKeyLogger(key) {
        this.getKeyLoggers().delete(key);
    }

    clear() {
        this.#keyLoggers = new Map();
    }

    listen() {
        this.getKeyLoggers().forEach(function(logger) {
            logger.listen();
        });
    }

    stopListen() {
        this.getKeyLoggers().forEach((logger) => {
            logger.stopListen();
        })
    }

    // getters and setters
    getKeyLoggers() {
        return this.#keyLoggers;
    }
}