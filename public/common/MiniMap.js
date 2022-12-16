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

        // if (typeof imageSource == "string") {
        //     this.#image = new Image("miniMap", imageSource, this.#container, sideLength, sideLength);
        //     this.#image.setDisplay("none");
        // } else {
        //     this.#image = null;
        // }
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
        ctx.beginPath();
        ctx.arc(
            this.getSideLength() * (this.getAgent().getXCoord() / this.getMap().getSideLength()),
            this.getSideLength() * (this.getAgent().getYCoord() / this.getMap().getSideLength()),
            this.getSideLength() * 0.02,
            0,
            2 * Math.PI
        );
        ctx.fillStyle = this.getAgent().getColor();
        console.log(this.getSideLength())
        ctx.fill();
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