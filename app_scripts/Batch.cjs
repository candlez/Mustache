
/**
 * the start value is exclusive
 * the end value is inclusive
 */
module.exports = class Batch {
    // fields
    #start;
    #end;
    #array;

    constructor(start, end) {
        this.#start = start;
        this.#end = end;
        this.#array = [];
    }

    // assuming that the timestamp is within the range
    insertChange(change) {
        this.#array.push(change);
        for (var i = this.#array.length - 2; i >= 0; i--) {
            if (this.#array[i + 1].timeStamp < this.#array[i].timeStamp) {
                var temp = this.#array[i];
                this.#array[i] = this.#array[i + 1];
                this.#array[i + 1] = temp;
            } else {
                break;
            }
        }
    }

    // maybe just array?
    // should the end be included?
    // no because the client will always have access to the batch length
    convertToData() {
        return {
            array: this.#array,
            start: this.start
        }
    }


    toArray() {
        return this.#array;
    }


    // getters
    getStart() {
        return this.#start;
    }
    getEnd() {
        return this.#end;
    }
}