import KeyLoggerContainer from "./KeyLoggerContainer.js";

/**
 * 
 */
export default class MovementKeyLoggerContainer extends KeyLoggerContainer {
    /**
     * 
     */
    constructor() {
        super();
    }

    // methods
    /**
     * 
     */
    startWASD() {
        this.addKeyLogger("w");
        this.addKeyLogger("a");
        this.addKeyLogger("s");
        this.addKeyLogger("d");
        this.listen();
    }
}