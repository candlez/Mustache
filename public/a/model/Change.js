

export default class Change {
    // fields
    #id;
    #code;
    #data;
    #timeStamp;

    static CODES = {
        SPAWNED: 0,
        MOVED: 1,
        SIZE_CHANGED: 2,
        VECTORS_CHANGED: 3
    }

    constructor(id, code, data, timeStamp) {
        this.#id = id;
        this.#code = code;
        this.#data = data;
        this.#timeStamp = timeStamp;
    }


    // getters and setters
    getID() {
        return this.#id;
    }
    getCode() {
        return this.#code;
    }
    getData() {
        return this.#data;
    }
    getTimeStamp() {
        return this.#timeStamp;
    }
}