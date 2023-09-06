
/**
 * code key:
 * 0 -> spawned
 * 1 -> moved
 * 2 -> changed size
 */
class Changed {
    static CODES = {
        SPAWNED: 0,
        MOVED: 1,
        SIZE_CHANGED: 2
    }

    constructor(code) {
        this.tracker = 0;
        this.codes = [
            false,
            false,
            false
        ];
        this.queue = [
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
        }, 100);
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
}

module.exports = Changed;