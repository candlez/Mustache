import QuadTree from "./QuadTree.js";
import DynamicQuadTree from "./DynamicQuadTree.js";



export default class Game {
    // fields
    #static;
    #dynamic;
    #player;

    
    constructor(width) {
        var half = width / 2;

        this.#static = new QuadTree(half, half, width);
        this.#dynamic = new DynamicQuadTree(half, half, width);
        
        this.#player = null;
    }


    /**
     * inserts an item into the QuadTree
     * @param {*} object 
     */
    insertStatic(object) {
        this.#static.insert(object);
    }


    /**
     * inserts an item into the DynamicQuadTree
     * @param {*} object 
     */
    insertDynamic(object) {
        this.#dynamic.insert(object);
    }



    gatherAnimations(bounds) {
        return this.#static.queryRange(bounds);
    }



    // getters and setters
    getStatic() {
        return this.#static;
    }
    getDynamic() {
        return this.#dynamic;
    }
    getPlayer() {
        return this.#player;
    }

    setPlayer(newPlayer) {
        this.#player = newPlayer;
    }
}