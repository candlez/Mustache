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
            console.log(id + " was not found in the tree")
        }
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