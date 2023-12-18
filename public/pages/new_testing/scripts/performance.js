import DataCollector from "../../../a/server/DataCollector.js";

class Tester {
    #field;

    constructor(a) {
        this.#field = a;
    }

    method() {
        console.log(this.getField());
    }

    method2() {
        console.log('Hello');
    }

    method3() {
        console.log("World");
    }

    method4(a, b, c, d) {
        console.log(a + b + c + d);
    }

    getField() {
        return this.#field;
    }
}

var obj2 = new Tester("Hello World 2");

// function bind(obj, oldFunction) {
//     return function() {
//         // code
//         console.log("Before");

//         // method
//         const t1 = performance.now();
//         oldFunction.call(obj);
//         const t2 = performance.now();

//         // code
//         console.log("After");
//         console.log("Duration: ", t2 - t1);
//     }
// }

// function watch(obj, methodName) {
//     obj[methodName] = bind(obj, obj[methodName]);
// }

const collector = new DataCollector();

collector.watch(obj2, "method");
collector.watch(obj2, "method2");
collector.watch(obj2, "method3");
collector.watch(obj2, "method4");


obj2.method();
obj2.method();
obj2.method2();
obj2.method4("a", "b", "c", "d");

collector.addEntryToLog();

// obj2.method.apply(obj2);