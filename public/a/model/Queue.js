

export default class Queue {
    // fields
    #head;
    #tail;
    #array;
    #size;

    static MAX_SIZE = 1000;

    constructor(length) {
        this.#array = [];
        if (length !== undefined) {
            this.#array.length = length;
        } else {
            this.#array.length = 20;
        }
        this.#head = 0;
        this.#tail = this.#array.length - 1;
        this.#size = 0;
    }

    size() {
        return this.#size;
    }

    isFull() {
        return this.#head == (this.#tail + 2) % this.#array.length;
    }


    isEmpty() {
        return this.#head == (this.#tail + 1) % this.#array.length;
    }


    enqueue(item) {
        if (this.isFull()) {
            this.grow();
        }
        this.#tail = (this.#tail + 1) % this.#array.length;
        this.#array[this.#tail] = item;
        this.#size++;
    }


    dequeue() {
        var item = this.peek();
        this.#array[this.#head] = undefined;
        this.#head = (this.#head + 1) % this.#array.length;
        this.#size--;
        return item;
    }


    peek() {
        if (this.isEmpty()) {
            throw new Error("queue is empty!");
        }
        return this.#array[this.#head];
    }


    clear() {
        this.#array = new Array(this.#array.length);
        this.#head = 0;
        this.#tail = this.#array.length - 1;
        this.#size = 0;
    }


    grow() {
        if (this.#array.length == Queue.MAX_SIZE) {
            throw new Error("Queue full, maximum sze exceeded");
        }
        var newArray = new Array(Math.min(this.#array.length * 2, Queue.MAX_SIZE));
        if (this.#size != 0) {
            for (var i = 0; i < this.#size; i++) {
                newArray[i] = this.#array[(this.#head + i) % this.#array.length];
            }
            this.#tail = this.#size - 1;    
        } else {
            this.#tail = newArray.length - 1;
        }
        this.#head = 0;
        this.#array = newArray;
    }


    shrink() {
        var newArray = new Array(Math.floor(this.#array.length / 2));
        if (this.#size != 0) {
            if (this.#size >= newArray.length) {
                throw new Error("Queue is too big to shrink");
            }
            for (var i = 0; i < this.#size; i++) {
                newArray[i] = this.#array[(this.#head + i) % this.#array.length];
            }        
            this.#tail = this.#size - 1;    
        } else {
            this.#tail = newArray.length - 1;
        }
        this.#head = 0;
        this.#array = newArray;
    }


    toString() {
        var str = "["
        for (var i = 0; i < this.#size; i++) {
            str += this.#array[(this.#head + i) % this.#array.length];
            if (i != this.#size - 1) {
                str += ", ";
            }
        }           
        return str + "]";
    }
}