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
        if (batch.array.length != 0) {
            console.log(batch);
        }
        

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
        if (change.getSender() == this.#game.getPlayer().getID()) {
            return;
        }

        const data = change.getData();
        switch (change.getCode()) {
            case Change.CODES.SPAWNED:
                console.log("Player Spawn Enacted: ", change); // temp
                if (!this.#game.getDynamicMap().has(change.getID())) {
                    this.#game.addObjectBasedOnData({
                        args: data,
                        timeStamp: change.getTimeStamp()
                    });
                }
                console.log(this.#game.getDynamicMap()) // temp
                break;
            case Change.CODES.VECTORS_CHANGED:
                console.log("Vector Change Enacted: ", change); // temp
                var obj = this.#game.getDynamicMap().get(change.getID());
                const old = obj.getVectors();
                obj.setVectors([
                    old[0] + data.deltaVectors[0],
                    old[1] + data.deltaVectors[1]
                ]);
                if (obj.getXCoord() != data.x || obj.getYCoord() != data.y) {
                    console.log("Position Changed With Vectors")
                    this.#game.moveDynamic(change.getID(), data.x, data.y);
                }
                console.log(obj.getVectors());
                break;
            case Change.CODES.SIZE_CHANGED:
                console.log("Size Change Enacted"); // temp
                this.#game.changeObjectSize(this.#game.getDynamicMap().get(change.getID()), data.deltaSize);
                break;
            default:
                // something went wrong
                console.log("Change Code Not Recognized: ", change.getCode());
        }
    }


    // enactPlayerChange(change) {
    //     const data = change.getData();
    //     switch (change.getCode()) {
    //         case Change.CODES.SPAWNED:
    //             console.log("Someone Else Told the Player to Spawn?");
    //             console.log(change);
    //             break;
    //         case Change.CODES.VECTORS_CHANGED:

    //             // code
    //             break;
    //         case Change.CODES.SIZE_CHANGED:
    //             // code
    //             break;
    //         default:
    //             // something went wrong
    //             console.log("Change Code Not Recognized: ", change.getCode());
    //     }
    // }

    // getters
    size() {
        return this.#queue.size();
    }
}