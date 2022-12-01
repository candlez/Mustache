import Agent from "./Agent.js";
import GameMap from './GameMap.js'
import MiniMap from './MiniMap.js';
import MapPack from './MapPack.js'
import AssetContainer from './AssetContainer.js';
import {animationLoop} from '../scripts/start.js'

export default class AnimatedGame {
    // fields
    #width;
    #height;
    #canvas;
    #ctx;
    #gameState;
    #map;
    #miniMap;
    #assetContainer;
    #agents;
    #player;
    #scale;

    /**
     * initializes an AnimatedGame object
     * 
     * @param {Number} width - the width of the canvas
     * @param {Number} height - the height of the canvas
     */
    constructor(width, height) {
        // takes parameters
        this.#width = width;
        this.#height = height;

        // creates a canvas with parameters, adds it to body
        this.#canvas = document.createElement('canvas');
        this.#canvas.id = "playSpace";
        document.body.appendChild(this.canvas);
        this.#canvas.width = width;
        this.#canvas.height = height;

        // creates context
        this.#ctx = this.#canvas.getContext('2d');

        // fields
        this.#gameState = false;
        this.#map = null;
        this.#miniMap = null;
        this.#assetContainer = null;
        this.#agents = [];
        this.#player = null;
        this.#scale = 1;
    }

    // standard getters and setters
    setWidth(newWidth) {
        this.#width = newWidth;
    }
    getWidth() {
        return this.#width;
    }
    setHeight(newHeight) {
        this.#height = newHeight;
        this.#canvas.height = newHeight;
    }
    getHeight() {
        return this.#height;
    }
    setMap(newMap) {
        if (newMap instanceof GameMap) {
            this.#map = newMap;
        }
    }
    getMap() {
        return this.#map;
    }
    getAgents() {
        return this.#agents; 
    }
    setScale(scale) {
        this.scale = scale;
    }
    getScale() {
        return this.#scale;
    }
    setMiniMap(newMiniMap) {
        this.#miniMap = newMiniMap;
    }
    getMiniMap() {
        return this.#miniMap;
    }
    getCTX() {
        return this.#ctx;
    }
    setCanvas(newCanvas) {
        this.#canvas = newCanvas;
        this.#ctx = newCanvas.getContext('2d');
    }
    getCanvas() {
        return this.#canvas;
    }
    setAssetContainer(newAssetContainer) {
        if (newAssetContainer instanceof AssetContainer) {
            this.assetContainer = newAssetContainer;
        }
    }
    getAssetContainer() {
        return this.#assetContainer;
    }
    setGameState(newGameState) {
        this.#gameState = newGameState;
    }
    getGameState() {
        return this.#gameState;
    }
    setPlayer(newPlayer) {
        this.#player = newPlayer;
    }
    getPlayer() {
        return this.#player;
    }

    // real methods
    /**
     * adds an Agent object to the list
     * 
     * @param agent - Agent object being added to the game
     */
    addAgent(agent) {
        if (agent instanceof Agent) {
            this.#agents.push(agent);
        }
        if (agent.isPlayer) {
            this.setPlayer(agent);
        }
    }

    /**
     * removes all the Agents with a given id
     * 
     * @param id - string that identifies the agents to be removed
     */
    removeAgent(id) {
        var indices = [];
        this.getAgents().forEach(function(agent, index) {
            if (agent.id == id) {
                indices.push(index);
                if (agent.getIsPlayer()) {
                    agent.getGame().getPlayer() = null;
                }
            }
        })
        for (var i = indices.length - 1; i > -1; i--) {
            this.getAgents().splice(indices[i], 1);
        }
        // needs testing
    }

    /**
     * calculates the change to x and y values of objects being moved
     */
    interpretKeys() {
        var unitVectors = [
            keysDown.right + (-1 * keysDown.left),
            (-1 * keysDown.up) + keysDown.down
        ];
        if (unitVectors[0] == 0 || unitVectors[1] == 0) {
            return {
                x: 10 * unitVectors[0],
                y: 10 * unitVectors[1]
            }
        } else {
            return {
                x: 7 * unitVectors[0],
                y: 7 * unitVectors[1]
            }
        }
    }

    /**
     * clears the whole play space of drawings
     */
    clearPlaySpace() {
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.map.backgroundColor;
            this.ctx.fill();
    }

    /**
     * gets the width and height of a page for elements that need
     * to be scaled based on window size
     * 
     * @returns - an array of the page width and height
     */
    getPageDimensions() {
        return [window.innerWidth, window.innerHeight];
    }

    /**
     * draws all objects on the play space
     */
    drawObjects() {
        this.miniMap.animate();
        this.map.drawMap(this.scale);

        for (var i = this.agents.length; i > 0; i--) {
            this.agents[i - 1].drawAgent(this.scale);
        }
        // work on this. agents are not assumed to be drawable
    }

    /**
     * draws a frame based on currently available data
     */
    animateFrame() {
        this.clearPlaySpace(); // erase everything from the previous frame
        this.drawObjects(); // draw the objects
        if (this.gameState) {
            requestAnimationFrame(animationLoop); // start over
        }
    }

    static playGame() {

    }
}