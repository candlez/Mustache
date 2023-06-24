import QuadTree from "./QuadTree.js";
import DynamicQuadTree from "./DynamicQuadTree.js";



export default class Game {
    // fields
    #static;
    #staticMap;
    #dynamic;
    #dynamicMap;
    #player;
    #backgroundAnimations;

    
    constructor(width) {
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
        }
    }



    gatherAnimations(bounds) {
        return this.#backgroundAnimations.concat(this.#static.queryRange(bounds))
            .concat(this.#dynamic.queryRange(bounds)).concat([this.#player]);
    }



    getPlayerCollisions() {
        const bounds = this.#player.getBounds();
        return this.#static.queryRange(bounds).concat(this.#dynamic.queryRange(bounds));
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

    setPlayer(newPlayer) {
        this.#player = newPlayer;
    }
}