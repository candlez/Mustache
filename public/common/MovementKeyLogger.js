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

    // getters and setters
    getKeyLoggers() {
        return this.#keyLoggers;
    }

    // real methods

    addKeyLogger(key) {
        this.getKeyLoggers().set(key, new KeyLogger(key));
    }

    /**
     * 
     */
    startWASD() {
        this.addKeyLogger("w");
        this.addKeyLogger("a");
        this.addKeyLogger("s");
        this.addKeyLogger("d");
        this.listen()
    }

    listen() {
        this.getKeyLoggers().forEach(function(logger) {
            logger.listen();
        });
    }
}