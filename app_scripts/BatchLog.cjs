

module.exports = class BatchLog {
    // fields
    #array;
    #index;

    constructor(length) {
        this.#index = 0;
        this.#array = new Array(length);
    }


    addBatch(batch) {
        this.#array[this.#index] = batch;
        this.#index = (this.#index + 1) % this.#array.length;
    }


    peek() {
        return this.#array[(this.#index - 1 + this.#array.length) % this.#array.length];
    }


    toInOrderArray() {
        var arr = new Array(this.#array.length);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = this.#array[(index + i) % this.#array.length];
        }
        return arr;
    }
}