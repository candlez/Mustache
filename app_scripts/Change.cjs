

module.exports = class Change {
    static CODES = {
        SPAWNED: 0,
        MOVED: 1,
        SIZE_CHANGED: 2,
        VECTORS_CHANGED: 3
    }

    // does the id need to be stored separate from the data?
    // most of the time (probably all of the time, the id will be sent in the data)
    constructor(id, code, data, timeStamp) {
        this.id = id;
        this.code = code;
        this.data = data;
        this.timeStamp = timeStamp;
    }
}