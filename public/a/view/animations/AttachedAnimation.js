import Animation from "./Animation.js";

export default class AttachedAnimation extends Animation {
    // fields
    #object;

    constructor(obj) {
        super();
        this.#object = obj;
    }

    // getters and setters
    setObject(newObject) {
        this.#object = newObject;
    }
    getObject() {
        return this.#object;
    }

    // methods
}