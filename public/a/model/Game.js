import QuadTree from "./QuadTree.js";
import DynamicQuadTree from "./DynamicQuadTree.js";
import TopCornerBounds from "./TopCornerBounds.js";
import Square from "./Square.js";


export default class Game {
    // fields
    #width;

    #static;
    #staticMap;
    #dynamic;
    #dynamicMap;
    #player;
    #backgroundAnimations;

    #zero;

    
    constructor(zero, width) {
        this.#zero = zero;
        this.#width = width;

        var half = width / 2;

        this.#static = new QuadTree(half, half, width);
        this.#staticMap = new Map();
        this.#dynamic = new DynamicQuadTree(half, half, width);
        this.#dynamicMap = new Map();
        
        this.#player = null;
        this.#backgroundAnimations = [];
    }


    /**
     * inserts an item into the QuadTree
     * @param {*} object 
     */
    insertStatic(object) {
        this.#static.insert(object);
        this.#staticMap.set(object.getID(), object);
    }


    removeStatic(id) {
        const obj = this.#staticMap.get(id);
        if (obj !== undefined) {
            this.#static.remove(obj);
            this.#staticMap.delete(id);
        }
    }


    /**
     * inserts an item into the DynamicQuadTree
     * @param {*} object 
     */
    insertDynamic(object) {
        this.#dynamic.insert(object);
        this.#dynamicMap.set(object.getID(), object);
    }


    removeDynamic(id) {
        const obj = this.#dynamicMap.get(id);
        if (obj !== undefined) {
            this.#dynamic.remove(obj);
            this.#dynamicMap.remove(id);
        }
    }



    moveDynamic(id, newX, newY) {
        const obj = this.#dynamicMap.get(id);
        if (obj !== undefined) {
            obj.setXCoord(newX);
            obj.setYCoord(newY);
            this.#dynamic.move(obj);
        } else {
            new Error(id + " was not found in the map")
        }
    }

    validateXCoord(obj, x) {
        if (x < 0) {
            return 0;
        }
        if (x + obj.getSize() > this.#width) {
            return this.#width - obj.getSize();
        }
        return x;
    }
    validateYCoord(obj, y) {
        if (y < 0) {
            return 0;
        }
        if (y + obj.getSize() > this.#width) {
            return this.#width - obj.getSize();
        }
        return y;
    }


    evaluateVectors(obj, refreshRate) {
        const vectors = obj.getVectors();
        if (!vectors) {
            console.log(obj)
        }
        if (vectors[0] != 0 || vectors[1] != 0) {
            // this could be changed to be more efficient
            // for instance, if an object was running up against a wall, it's vectors
            // could be changed to zero (in that direction)
            // of course, we would need to tell the server about this (or not actually because every client would do that)
            var newX = this.validateXCoord(obj, obj.getXCoord() + (vectors[0] / refreshRate));
            var newY = this.validateYCoord(obj, obj.getYCoord() + (vectors[1] / refreshRate));

            // finalizing changes
            if (obj == this.#player) {
                obj.setXCoord(newX);
                obj.setYCoord(newY);
            } else {
                try {
                    this.moveDynamic(
                        obj.getID(),
                        newX,
                        newY
                    );  
                } catch (error) {
                    console.log(obj);
                }
  
            }
        }
    }



    runSimulation(refreshRate) {
        for (const obj of this.#dynamicMap.values()) {
            this.evaluateVectors(obj, refreshRate);
        }
        this.evaluateVectors(this.#player, refreshRate);
    }


    
    getGameTime() {
        return Date.now() - this.#zero;
    }



    gatherAnimations(bounds) { // this has got to be fixed
        return this.#backgroundAnimations.concat(this.#static.queryRange(bounds))
            .concat(this.#dynamic.queryRange(bounds)).concat([this.#player]);
    }



    getPlayerCollisions() {
        const bounds = this.#player.getBounds();
        return this.#static.queryRange(bounds).concat(this.#dynamic.queryRange(bounds));
    }



    spawnPlayer(name, color) {
        const startingSize = 200; // this needs to be changed!
        /**
         * I think it ought to be stored in the Game object, passed in as
         * an argument to the constructor, and recieved from the server in the
         * initialization phase
         */

        
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        
 
        this.#player = new Square(name, getRandomInt(this.#width - startingSize),
            getRandomInt(this.#width - startingSize), startingSize, color);
        
        return this.#player;
    }



    addObjectBasedOnData(data) { // this is RazorRoyale specific
        var obj;
        if (data.args.type == "square") {
            obj = new Square(data.args.id, data.args.x, data.args.y, data.args.args.size, data.args.args.color);
        } else {
            console.log("not a square!")
        }

        if (obj !== undefined) {
            if (data.args.dynamic) {
                if (data.args.vectors[0] != 0 || data.args.vectors[1] != 0) {
                    obj.setVectors(data.args.vectors);
                    var diff = data.timeStamp - data.args.lastVectorChange;
                    diff = diff / 1000;
                    var newX = this.validateXCoord(obj, data.args.x + (diff * data.args.vectors[0]));
                    var newY = this.validateYCoord(obj, data.args.y + (diff * data.args.vectors[1]));
                    obj.setXCoord(newX);
                    obj.setYCoord(newY);
                }
                this.insertDynamic(obj);
            } else {
                this.insertStatic(obj);
            }
        }
    }


    // should this be done in delta or literal amount?
    // lets do deltas because that works better with our program
    changeObjectSize(obj, deltaSize) {
        const half = deltaSize / 2;
        obj.setSize(obj.getSize() + deltaSize);
        obj.setXCoord(this.validateXCoord(obj, obj.getXCoord() - half));
        obj.setYCoord(this.validateYCoord(obj, obj.getYCoord() - half));
        if (obj.getID() != this.#player.getID()) {
            this.#dynamic.move(obj);
        }   
    }



    // background animations
    addBackgroundAnimation(animation) {
        this.#backgroundAnimations.push(animation);
    }
    clearBackgroundAnimations() {
        this.#backgroundAnimations = [];
    }


    getObjectByID(id) {
        if (id == this.#player.getID()) {
            return this.#player;
        } else if (this.#dynamicMap.has(id)) {
            return this.#dynamicMap.get(id);
        } else if (this.#staticMap.has(id)) {
            return this.#staticMap.get(id);
        } else {
            // considering that we have code that purposefully passes bad IDs in
            // is this really necessary?
            console.log("ID Not Found: " + id);
        }
    }



    // getters and setters
    getStatic() {
        return this.#static;
    }
    getStaticMap() {
        return this.#staticMap;
    }
    getDynamic() {
        return this.#dynamic;
    }
    getDynamicMap() {
        return this.#dynamicMap;
    }
    getPlayer() {
        return this.#player;
    }
    getBackGroundAnimations() {
        return this.#backgroundAnimations;
    }
    getWidth() {
        return this.#width;
    }
    getBounds() {
        return new TopCornerBounds(0, 0, this.#width, this.#width);
    }

    setPlayer(newPlayer) {
        this.#player = newPlayer;
    }
}