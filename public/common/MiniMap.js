import GameMap from './GameMap.js'
import Image from './Image.js'

/**
 * 
 */
export default class MiniMap extends GameMap {
    // fields
    #map;
    #agent;
    #container;
    #canvas;
    #ctx;

    /**
     * initializes a new MiniMap object
     * 
     * @param {GameMap} map - the map on which the MiniMap is based
     * @param {Agar} agar - the agar that will be displayed in the MiniMap
     */
    constructor(game, map, agent, sideLength, properties) {
        super(game, sideLength / 2, sideLength / 2, sideLength, properties);
        this.#map = map;
        this.#agent = agent;

        // create div and canvas element
        this.#container = document.createElement('div');
        this.#container.className = 'miniMapContainer';
        this.#container.style.width = sideLength + 10 + 'px';
        this.#container.style.height = sideLength + 10 + 'px';
        document.body.appendChild(this.#container);

        this.#canvas = document.createElement('canvas');
        this.#canvas.className = 'miniMap'
        this.#canvas.width = sideLength;
        this.#canvas.height = sideLength;
        this.#container.appendChild(this.#canvas);

        this.#ctx = this.#canvas.getContext('2d');
    }
    // standard getters and setters
    getMap() {
        return this.#map;
    }
    setAgent(newAgent) {
        this.#agent = newAgent;
    }
    getAgent() {
        return this.#agent;
    }
    getContainer() {
        return this.#container;
    }
    getCanvas() {
        return this.#canvas;
    }
    getCTX() {
        return this.#ctx;
    }

    // real methods
    /**
     * hides the container elements
     */
    hideContainer() {
        this.#container.style.display = 'none';
    }

    /**
     * shows the container elements
     */
    showContainer() {
        this.#container.style.display = 'block';
    }

    /**
     * erases everything that is drawm on the canvas
     */
    clearCanvas() {
        const ctx = this.getCTX();
        ctx.beginPath();
        ctx.rect(0, 0, this.getSideLength(), this.getSideLength());
        ctx.fillStyle = this.getBackgroundColor();
        ctx.fill();
    }

    draw(scale) {
        switch (this.getAnimationType()) {
            case 0:
                break;
            case 1:
                this.getImage().drawImageOnCanvas(
                    this.getCTX(),
                    0,
                    0,
                    this.getSideLength(),
                    this.getSideLength()
                );
                break;
            case 2:
                console.log(this, scale, this.getBounds(), this.getLineColor())
                this.drawGrid(
                    scale,
                    this.getBounds(),
                    this.getLineColor()
                );
        }
    }

    /**
     * draws the agar on the map in the container
     */
    drawAgent() {
        const ctx = this.getCTX();
        var miniMapCoords = {
            x: this.getSideLength() * (this.getAgent().getXCoord() / this.getMap().getSideLength()),
            y: this.getSideLength() * (this.getAgent().getYCoord() / this.getMap().getSideLength())
        }
        const minimumWidth = 20;
        var agentSize = (this.getAgent().getWidth() / this.getMap().getSideLength()) * this.getSideLength();
        if (agentSize < minimumWidth) {
            agentSize = minimumWidth;
        }
        switch (this.getAgent().getAnimationType()) {
            case 0: // animation type: none
                break;
            case 1: // animation type: image
            case 2: // animation type: rectangle
                ctx.beginPath();
                ctx.rect(
                    miniMapCoords.x,
                    miniMapCoords.y,
                    agentSize,
                    agentSize
                );
                ctx.fillStyle = this.getAgent().getColor();
                ctx.fill();
                break;
            case 3: // animation type: circle
                ctx.beginPath();
                ctx.arc(
                    miniMapCoords.x,
                    miniMapCoords.y,
                    agentSize / 2, //make this update with increase in size
                    0,
                    2 * Math.PI
                );
                ctx.fillStyle = this.getAgent().getColor();
                ctx.fill();
                break;
        }
    }

    /**
     * animates one frame on the minimap
     */
    animate() {
        this.clearCanvas();
        this.draw(1);
        this.drawAgent();
    }
}