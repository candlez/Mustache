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

    listen() {
        this.getKeyLoggers().forEach(function(logger) {
            logger.listen();
        });
    }
}