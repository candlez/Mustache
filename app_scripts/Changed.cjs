
/**
 * code key:
 * 0 -> spawned
 * 1 -> moved
 * 2 -> size changed
 * 3 -> vectors changed
 */
class Changed {
    static CODES = {
        SPAWNED: 0,
        MOVED: 1,
        SIZE_CHANGED: 2,
        VECTORS_CHANGED: 3
    }

    constructor(code) {
        this.tracker = 0;
        this.codes = [
            false,
            false,
            false,
            false
        ];
        this.queue = [
            false,
            false,
            false,
            false
        ]
        this.timers = [];

        if (code !== undefined) {
            this.addChange(code);
        }
    }

    addChange(code) {
        if (this.codes[code]) {
            this.queue[code] = true;
        } else {
            this.codes[code] = true;
            this.tracker++;
            this.startTimer(code);
        }
    }

    startTimer(code) {
        setTimeout(() => {
            if (this.queue[code]) {
                this.startTimer(code);
                this.queue[code] = false;
            } else {
                this.codes[code] = false;
                this.tracker--;
            }
        }, 10000); // this value needs to be fine-tuned
    }

    getChanged() {
        return this.tracker != 0;
    }

    getSpawned() {
        return this.codes[Changed.CODES.SPAWNED];
    }


    getMoved() {
        return this.codes[Changed.CODES.MOVED];
    }


    getSizeChanged() {
        return this.codes[Changed.CODES.SIZE_CHANGED];
    }

    getVectorsChanged() {
        return this.codes[Changed.CODES.VECTORS_CHANGED];
    }
}

module.exports = Changed;