

export default class Change {
    // fields
    #id;
    #code;
    #data;
    #timeStamp;
    #sender;

    static CODES = {
        SPAWNED: 0,
        MOVED: 1,
        SIZE_CHANGED: 2,
        VECTORS_CHANGED: 3,
        DISCONNECTED: 4,
    }

    constructor(id, code, data, timeStamp, sender) {
        this.#id = id;
        this.#code = code;
        this.#data = data;
        this.#timeStamp = timeStamp;
        this.#sender = sender;
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
    getSender() {
        return this.#sender;
    }
}