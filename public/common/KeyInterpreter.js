

export default class KeyInterpreter { // should this class be abstract? it feels pretty barren
    // fields
    #keyLoggerContainers;

    constructor() {
        this.#keyLoggerContainers = []; // should this field be an array?
    }

    // methods
    interpret() { // this method needs to be thought out more

    }

    // getters and setters
    getKeyLoggerContainers() {
        return this.#keyLoggerContainers;
    }
}