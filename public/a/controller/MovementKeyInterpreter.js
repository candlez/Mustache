import KeyInterpreter from "./KeyInterpreter.js";
import KeyLoggerContainer from "./KeyLoggerContainer.js";

export default class MovementKeyInterpreter extends KeyInterpreter {
    // fields
    #object;

    #up;
    #down;
    #left;
    #right;

    constructor(object, upKeyCode, leftKeyCode, downKeyCode, rightKeyCode) {
        super();
        this.#object = object;

        this.#up = upKeyCode;
        this.#left = leftKeyCode;
        this.#down = downKeyCode;
        this.#right = rightKeyCode;

        const container = new KeyLoggerContainer();
        container.addKeyLogger(upKeyCode);
        container.addKeyLogger(leftKeyCode);
        container.addKeyLogger(downKeyCode);
        container.addKeyLogger(rightKeyCode);
        this.addKeyLoggerContainer("movementKeys", container);
    }

    // methods
    interpret() {
        const loggers = this.getKeyLoggerContainer("movementKeys").getKeyLoggers();
        const unitVectors = {
            horizontal: loggers.get(this.#right).getKeyDown() + (-1 * loggers.get(this.#left).getKeyDown()),
            vertical: (-1 * loggers.get(this.#up).getKeyDown()) + loggers.get(this.#down).getKeyDown()
        }
        if (unitVectors.horizontal == 0 || unitVectors.vertical == 0) {
            this.#object.move(10 * unitVectors.horizontal, 10 * unitVectors.vertical);
        } else {
            this.#object.move(7 * unitVectors.horizontal, 7 * unitVectors.vertical);
        }
    }


    // getters and setters
    
}