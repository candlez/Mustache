import Queue from "../model/Queue.js";


describe("unit testing for the Queue class", () => {
    var queue;

    beforeEach(() => {
        queue = new Queue(6);
    });


    test("testing constructor", () => {
        expect(queue.isEmpty()).toBe(true);
        expect(queue.isFull()).toBe(false);
        expect(queue.size()).toBe(0);
    });


    test("testing enqueue, dequeue, and peek", () => {
        queue.enqueue(3);
        expect(queue.isEmpty()).toBe(false);
        expect(queue.isFull()).toBe(false);
        expect(queue.size()).toBe(1);
        expect(queue.peek()).toBe(3);

        queue.enqueue(10);
        expect(queue.isEmpty()).toBe(false);
        expect(queue.isFull()).toBe(false);
        expect(queue.size()).toBe(2);
        expect(queue.peek()).toBe(3);

        expect(queue.dequeue()).toBe(3);
        expect(queue.isEmpty()).toBe(false);
        expect(queue.isFull()).toBe(false);
        expect(queue.size()).toBe(1);
        expect(queue.peek()).toBe(10);

        expect(queue.dequeue()).toBe(10);
        expect(queue.isEmpty()).toBe(true);
        expect(queue.isFull()).toBe(false);
        expect(queue.size()).toBe(0);
    });

    test("testing peek and dequeue on empty queue", () => {
        var err = null;
        try {
            queue.peek();
        } catch (error) {
            err = error;
        }
        expect(err).not.toBeNull();

        err = null;
        try {
            queue.dequeue();
        } catch (error) {
            err = error;
        }
        expect(err).not.toBeNull();
    });

    test("testing toString", () => {
        expect(queue.toString()).toBe("[]");

        queue.enqueue(1);
        expect(queue.toString()).toBe("[1]");

        queue.enqueue(2);
        expect(queue.toString()).toBe("[1, 2]");

        expect(queue.dequeue()).toBe(1);
        expect(queue.toString()).toBe("[2]");

        queue.enqueue(3);
        queue.enqueue(4);
        queue.enqueue(5);
        queue.enqueue(6);
        expect(queue.toString()).toBe("[2, 3, 4, 5, 6]")

        expect(queue.dequeue()).toBe(2);
        expect(queue.dequeue()).toBe(3);
        expect(queue.dequeue()).toBe(4);
        expect(queue.toString()).toBe("[5, 6]");

        queue.enqueue(7);
        queue.enqueue(8);
        expect(queue.toString()).toBe("[5, 6, 7, 8]");
    });

    test("testing shrinking, growing, and clear", () => {
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);
        queue.enqueue(4);
        queue.enqueue(5);
        expect(queue.isFull()).toBe(true);
        queue.enqueue(6);
        expect(queue.size()).toBe(6);
        expect(queue.toString()).toBe("[1, 2, 3, 4, 5, 6]");

        var err = null;
        try {
            queue.shrink();
        } catch (error) {
            err = error;
        }
        expect(err).not.toBeNull();
        
        queue.enqueue(7);
        queue.enqueue(8);
        queue.enqueue(9);
        queue.enqueue(10);
        queue.enqueue(11);
        expect(queue.isFull()).toBe(true);

        queue.enqueue(12);
        expect(queue.toString()).toBe("[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]");

        queue.dequeue();
        queue.dequeue();
        queue.dequeue();
        queue.dequeue();
        queue.dequeue();
        queue.dequeue();
        queue.dequeue();
        expect(queue.toString()).toBe("[8, 9, 10, 11, 12]");
        expect(queue.isFull()).toBe(false);
        queue.shrink();
        queue.shrink();
        expect(queue.toString()).toBe("[8, 9, 10, 11, 12]");
        expect(queue.isFull()).toBe(true);

        queue.dequeue();
        queue.dequeue();
        queue.dequeue();
        queue.enqueue(13);
        queue.enqueue(14);
        queue.grow();
        expect(queue.toString()).toBe("[11, 12, 13, 14]");

        queue.clear();
        expect(queue.isEmpty()).toBe(true);
        expect(queue.size()).toBe(0);
    });

    test("testing Queue.MAX_SIZE", () => {
        for (var i = 1; i < Queue.MAX_SIZE; i++) {
            queue.enqueue(i);
        }
        expect(queue.isFull()).toBe(true);
        var err = null;
        try {
            queue.enqueue("hehehe");
        } catch (error) {
            err = error;
        }
        expect(err).not.toBeNull();
    });
});