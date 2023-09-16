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

    
    constructor(width) {
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



    evaluateVectors(obj) {
        const vectors = obj.getVectors();
        if (vectors[0] != 0 || vectors[1] != 0) {
            var newX = obj.getXCoord() + vectors[0];
            var newY = obj.getYCoord() + vectors[1];
            if (newX < 0) {
                newX = 0;
            } else if (newX + obj.getSize() > this.#width) {
                newX = this.#width - obj.getSize();
            }
            if (newY < 0) {
                newY = 0;
            } else if (newY + obj.getSize() > this.#width) {
                newY = this.#width - obj.getSize();
            }
            if (obj == this.#player) {
                obj.setXCoord(newX);
                obj.setYCoord(newY);
            } else {
                this.moveDynamic(
                    obj.getID(),
                    newX,
                    newY
                );    
            }
        }
    }



    runSimulation() {
        for (const obj of this.#dynamicMap.values()) {
            this.evaluateVectors(obj)
        }
        this.evaluateVectors(this.#player);
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



    changeObjectSize(id, newSize) {
        const obj = this.#dynamicMap.get(id);
        obj.grow(newSize - obj.getSize());
        this.#dynamic.move(obj);
    }



    // background animations
    addBackgroundAnimation(animation) {
        this.#backgroundAnimations.push(animation);
    }


    clearBackgroundAnimations() {
        this.#backgroundAnimations = [];
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