import Display from "./Display.js";

export default class InteractiveDisplay extends Display {
    // fields
    #keyInterpreters

    constructor(width, height, xCoord, yCoord) {
        super(width, height, xCoord, yCoord);

        this.#keyInterpreters = []
    }

    // methods
    static createFullScreen() {
        return new InteractiveDisplay(window.innerWidth, window.innerHeight);
    }

    interpretKeys() {
        this.getKeyInterpreters().forEach((interpreter) => {
            interpreter.interpret();
        });
    }

    animateFrame() {
        this.interpretKeys()
        super.animateFrame();
    }

    addKeyInterpreter(newKeyInterpreter) {
        this.#keyInterpreters.push(newKeyInterpreter);
    }

    // getters and setters
    getKeyInterpreters() {
        return this.#keyInterpreters;
    }
}