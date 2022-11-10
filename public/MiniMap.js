import GameMap from './GameMap.js'
import Image from './Image.js'

export default class MiniMap extends GameMap {
    /**
     * constructor for the MiniMap class
     * 
     * @param {GameMap} map - the map on which the MiniMap is based
     * @param {Agar} agar - the agar that will be displayed in the MiniMap
     */
    constructor(game, map, agar, width, height, imageSource) {
        super(game, width / 2, height / 2, width, height, width * 0.1);
        this.map = map;
        this.agar = agar

        // create div and canvas element
        this.container = document.createElement('div');
        this.container.className = 'miniMapContainer';
        this.container.style.width = width + 10 + 'px';
        this.container.style.height = height + 10 + 'px';
        document.body.appendChild(this.container);

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'miniMap'
        this.canvas.width = width;
        this.canvas.height = height;
        this.container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');

        if (typeof imageSource == "string") {
            this.image = new Image("miniMap", imageSource, this.container, width, height);
            this.image.changeDisplay("none");
        } else {
            this.image = null;
        }
    }

    /**
     * hides the container elements
     */
    hideContainer() {
        this.container.style.display = 'none';
    }

    /**
     * shows the container elements
     */
    showContainer() {
        this.container.style.display = 'block';
        this.drawMap();
        this.drawAgar();
    }

    clearCanvas() {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fill();
    }

    drawMap() {
        if (this.image == null) {
            this.drawGrid(1, this.bounds, "grey");
        } else {
            this.image.drawImageOnCanvas(this.ctx, 0, 0, this.width, this.height);
        }
        
    }

    /**
     * draws the agar
     */
    drawAgar() {
        this.ctx.beginPath();
        this.ctx.arc(
            this.width * (this.agar.xCoord / this.map.width),
            this.height * (this.agar.yCoord / this.map.height),
            this.width * 0.02,
            0,
            2 * Math.PI
        );
        this.ctx.fillStyle = this.agar.color;
        this.ctx.fill();
    }
}