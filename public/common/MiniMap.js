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
    #image;

    /**
     * initializes a new MiniMap object
     * 
     * @param {GameMap} map - the map on which the MiniMap is based
     * @param {Agar} agar - the agar that will be displayed in the MiniMap
     */
    constructor(game, map, agent, width, height, imageSource) {
        super(game, width / 2, height / 2, width, height, width * 0.1);
        this.#map = map;
        this.#agent = agent;

        // create div and canvas element
        this.#container = document.createElement('div');
        this.#container.className = 'miniMapContainer';
        this.#container.style.width = width + 10 + 'px';
        this.#container.style.height = height + 10 + 'px';
        document.body.appendChild(this.#container);

        this.#canvas = document.createElement('canvas');
        this.#canvas.className = 'miniMap'
        this.#canvas.width = width;
        this.#canvas.height = height;
        this.#container.appendChild(this.#canvas);

        this.#ctx = this.#canvas.getContext('2d');

        if (typeof imageSource == "string") {
            this.#image = new Image("miniMap", imageSource, this.#container, width, height);
            this.#image.setDisplay("none");
        } else {
            this.#image = null;
        }
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
    getImage() {
        return this.#image;
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
        this.#ctx.beginPath();
        this.#ctx.rect(0, 0, this.getCanvas().width, this.getCanvas().height);
        this.#ctx.fillStyle = this.getBackgroundColor();
        this.#ctx.fill();
    }

    /**
     * draws the map in the container
     */
    draw() {
        if (this.getImage() instanceof Image) {
            this.getImage().drawImageOnCanvas(this.getCTX(), 0, 0, this.getWidth(), this.getHeight());
        } else {
            this.drawGrid(1, this.getBounds(), "grey");            
        }
        
    }

    /**
     * draws the agar on the map in the container
     */
    drawAgent() {
        const ctx = this.getCTX();
        ctx.beginPath();
        ctx.arc(
            this.getWidth() * (this.getAgent().getXCoord() / this.getMap().getWidth()),
            this.getHeight() * (this.getAgent().getYCoord() / this.getMap().getHeight()),
            this.getWidth() * 0.02,
            0,
            2 * Math.PI
        );
        ctx.fillStyle = this.getAgent().getColor();
        ctx.fill();
    }

    /**
     * animates one frame on the minimap
     */
    animate() {
        this.clearCanvas();
        this.draw();
        this.drawAgent();
    }
}