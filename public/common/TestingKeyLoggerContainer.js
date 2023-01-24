import KeyLoggerContainer from './KeyLoggerContainer.js';

/**
 * 
 */
export default class TestingKeyLoggerContainer extends KeyLoggerContainer {
    /**
     * 
     */
    constructor() {
        super();
    }

    // real methods
    /**
     * 
     */
    startTestKeys() {
        this.addKeyLogger("9");
        this.addKeyLogger("8");
        this.addKeyLogger("7");
        this.addKeyLogger("6");
        this.addKeyLogger("5");
        this.listen();
    }
}