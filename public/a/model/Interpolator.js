import Queue from "./Queue.js";
import Change from "./Change.js";

export default class Interpolator {
    // fields
    #queue;
    #game;


    constructor(game) {
        this.#queue = new Queue(100); // size?
        this.#game = game;
    }


    loadBatch(batch) {
        // batch is an object with .array and .start
        // if (batch.array.length != 0) {
        //     console.log(batch);
        // }
        

        // what is the use of .start?
        for (var i = 0; i < batch.array.length; i++) {
            var obj = batch.array[i];
            this.#queue.enqueue(new Change(obj.id, obj.code, obj.data, obj.timeStamp, obj.sender));
        }
    }


    unloadChanges(timeStamp) {
        var curr;
        while (this.#queue.size() > 0) {
            curr = this.#queue.peek();
            if (curr.getTimeStamp() <= timeStamp) {
                try {
                    this.enactChange(curr);
                } catch (error) {
                    console.log(error);
                } 
            } else {
                return;
            }
            this.#queue.dequeue();
        }
    }


    enactChange(change) {
        const player = this.#game.getPlayer()
        if (change.getSender() == player.getID()) {
            return;
        }
        var obj = this.#game.getObjectByID(change.getID());

        // temp
        // console.log(this.#game.getGameTime() - change.getTimeStamp(), this.#game.getGameTime(), change.getTimeStamp());

        const data = change.getData();
        switch (change.getCode()) {
            case Change.CODES.SPAWNED:
                console.log("Player Spawn Enacted: ", change); // temp
                if (!obj) {
                    this.#game.addObjectBasedOnData({
                        args: data,
                        timeStamp: change.getTimeStamp()
                    });
                }
                console.log(this.#game.getDynamicMap()) // temp
                break;
            case Change.CODES.MOVED:
                if (!obj) return;
                console.log("Move Enacted: ", change); // temp
                obj.setXCoord(obj.getXCoord() + data.deltaX);
                obj.setYCoord(obj.getYCoord() + data.deltaY);
                break;
            case Change.CODES.VECTORS_CHANGED:
                if (!obj) return;
                // console.log("Vector Change Enacted: ", change); // temp
                const old = obj.getVectors();
                obj.setVectors([
                    old[0] + data.deltaVectors[0],
                    old[1] + data.deltaVectors[1]
                ]);
                if (data.x == "ignore") break;
                if (obj.getXCoord() != data.x || obj.getYCoord() != data.y) {
                    console.log("Position Changed With Vectors"); // temp

                    const colors = ["blue", "green", "yellow", "crimson", "pink", "purple"];
                    function getRandomInt(max) {
                        return Math.floor(Math.random() * max);
                    }
                    player.setColor(colors[getRandomInt(colors.length)]);

                    this.#game.moveDynamic(change.getID(), data.x, data.y);
                }
                break;
            case Change.CODES.SIZE_CHANGED:
                if (!obj) return;
                console.log("Size Change Enacted"); // temp
                this.#game.changeObjectSize(this.#game.getDynamicMap().get(change.getID()), data.deltaSize);
                break;
            case Change.CODES.DISCONNECTED:
                console.log("Player Disconnected"); // temp
                this.#game.removeDynamic(change.getID());
                console.log(this.#game.getDynamicMap()); // temp
                break;
            default:
                // something went wrong
                console.log("Change Code Not Recognized: ", change.getCode());
        }
    }

    // getters
    size() {
        return this.#queue.size();
    }
}