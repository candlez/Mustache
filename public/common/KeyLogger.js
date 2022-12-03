

export default class KeyLogger {
    // fields
    #keyID;
    #keyDown;
    
    /**
     * 
     * @param {String} keyID 
     */
    constructor(keyID) {
        this.#keyID = keyID;
        this.#keyDown = false;
    }

    // standard getters and setters
    getKeyID() {
        return this.#keyID;
    }
    setKeyDown(newState) {
        this.#keyDown = newState;
    }
    getKeyDown() {
        return this.#keyDown;
    }

    // real methods

    boolToString(keyDown) {
        if (keyDown) {
            return "keydown";
        } else {
            return "keyup";
        }
    }

    handleEvent(event) {
        if (event.key == this.getKeyID()) {
            document.removeEventListener(this.boolToString(!this.getKeyDown()), this);
            this.setKeyDown(!this.getKeyDown())
            this.listen();
        }
    }


    listen() {
        document.addEventListener(this.boolToString(!this.getKeyDown()), this);
    }
}