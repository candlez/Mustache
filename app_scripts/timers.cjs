// timer functions
function resetChange(map, id) {
    obj = map.get(id);
    obj.codes.shift();
    if (obj.codes.length == 0) {
        obj.changed = false;
    }
}

function startTimer(map, id) {
    map.get(id).timers.push(setTimeout(resetChange, 100, map, id));
}


const changedTimeOut = function(map, id, code) {
    obj = map.get(id);
    index = obj.codes.indexOf(code);
    if (index != -1) {
        obj.codes.splice(index, 1);
        clearTimeout(obj.timers[index]);
        obj.timers.splice(index, 1);
    }
    map.get(id).codes.push(code);
    map.get(id).changed = true;
    startTimer(map, id);
}


class Changed {
    // fields
    #vals;

    constructor() {
        /**
         * indices to values
         * 0 -> spawned
         * 1 -> moved
         * 2 -> sizeChanged
         */
        this.#vals = [
            false,
            false,
            false
        ];
    }


    // getters
    getSpawned() {
        return this.#vals[0];
    }

    getMoved() {
        return this.#vals[1];
    }

    getSizeChanged() {
        return this.#vals[2];
    }
}


module.exports = {changedTimeOut: changedTimeOut}