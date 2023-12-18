/**
 * collects performance data by watching method calls
 */
export default class DataCollector {
    // private fields
    #methods;
    #performanceLog;
    #newEntry;

    constructor() {
        this.#methods = [];
        this.#performanceLog = [];
        this.#newEntry = new Map();
    }

    /**
     * 
     * @param {Object} obj 
     * @param {Function} method 
     * @returns a Function that will call the original method and
     *          collect data on it
     */
    bind(obj, method, callBack) {
        return function(...args) {
            const t1 = performance.now();
            method.apply(obj, args);
            const t2 = performance.now();
            callBack(t2 - t1);
        }
    }

    /**
     * records data about a method of an object
     * 
     * @param {Object} obj - the object being watched
     * @param {String} methodName - the name of the method being watched
     */
    watch(obj, methodName) {
        if (this.#newEntry.has(methodName)) {
            throw new Error("Attempted to watch method that is already being watched: ", methodName, obj);
        }
        this.#methods.push(methodName);
        this.#newEntry.set(methodName, {
            count: 0,
            durations: []
        });
        obj[methodName] = this.bind(obj, obj[methodName], (duration) => {
            this.updateEntry(methodName, duration);
        });
    }

    /**
     * 
     * @param {Object} obj 
     * @param {String} methodName 
     */
    peg(obj, methodName) {
        if (this.#methods.length != 0) {
            throw new Error("Attempted to peg method after watching other methods", methodName, obj);
        }
        this.#methods.push(methodName);
        this.#newEntry.set(methodName, {
            count: 0,
            durations: []
        });
        obj[methodName] = this.bind(obj, obj[methodName], (duration) => {
            this.updateEntry(methodName, duration);
            this.addEntryToLog();
        });
    }

    /**
     * updates the current log entry with data from a new call
     * 
     * @param {String} methodName - the name of the method being updated
     * @param {Number} duration - the amount of time the call took in ms
     */
    updateEntry(methodName, duration) {
        this.#newEntry.get(methodName).count++;
        this.#newEntry.get(methodName).durations.push(duration);
    }

    /**
     * takes the newEntry, coverts it to a String, and adds it to
     * the performance log
     */
    addEntryToLog() {
        var logEntry = "";
        const newEntry = new Map();
        for (var i = 0; i < this.#methods.length; i++) {
            const method = this.#methods[i];
            newEntry.set(method, {
                count: 0,
                durations: []
            });
            const data = this.#newEntry.get(method);
            if (i != 0) logEntry += ",";
            logEntry += data.count;
            for (var j = 0; j < data.count; j++) {
                logEntry += "," + data.durations[j];
            }
        }
        this.#performanceLog.push(logEntry);
        this.#newEntry = newEntry;
    }

    /**
     * converts collected data into a CSV style String
     * 
     * @returns a CSV style String of all of the data collected
     */
    toString() {
        return this.#methods.join(",") + "\n" + this.#performanceLog.join("\n");
    }

    /**
     * creates a CSV Blob out of the current data and
     * resets the data so new data can be collected
     * 
     * @returns a CSV blob of all of the data collected thus far
     */
    createBlob() {
        const str = this.toString();
        this.#performanceLog = [];
        console.log(str);
        return new Blob([str], {type: "text/csv"});
    }
}