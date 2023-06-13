

export default class KeyInterpreter { // should this class be abstract? it feels pretty barren
    // fields
    #active;
    #keyLoggerContainers;

    constructor() {
        this.#active = false;
        this.#keyLoggerContainers = new Map();
    }

    // methods
    interpret() { // this method needs to be thought out more
        throw new Error("'interpret' is abstract")
    }

    activate() {
        this.#active = true;
        for (const key of this.getKeyLoggerContainers().keys()) {
            this.getKeyLoggerContainers().get(key).listen();
        }
    }

    deactivate() {
        this.#active = false;
        for (const key of this.getKeyLoggerContainers().keys()) {
            this.getKeyLoggerContainers().get(key).stopListen();
        }
    }

    addKeyLoggerContainer(id, newKeyLoggerContainer) {
        this.#keyLoggerContainers.set(id, newKeyLoggerContainer);
    }

    removeKeyLoggerContainer(id) {
        this.#keyLoggerContainers.delete(id);
    }

    getKeyLoggerContainer(id) {
        return this.#keyLoggerContainers.get(id);
    }

    // getters and setters
    getActive() {
        return this.#active;
    }
    getKeyLoggerContainers() {
        return this.#keyLoggerContainers;
    }
}