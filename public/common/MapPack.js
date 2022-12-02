import GameMap from './GameMap.js'
import Image from './Image.js'

/**
 * 
 */
export default class MapPack extends GameMap {
    // fields
    #maps;

    /**
     * constructor for the MapPack class
     * 
     * @param {Game} game - Game object to which the MapPack belongs
     * @param {Number} xCoord - absolute position of the map in x
     * @param {Number} yCoord - absolute position of the map in y
     * @param {Number} width - width in absolute pixels (needs to be divisible by 1000)
     * @param {Number} height - height in absolute pixels (needs to be divisible by 1000)
     */
    constructor(game, xCoord, yCoord, width, height, squareSize, sources) {
        super(game, xCoord, yCoord, width, height, squareSize);

        this.#maps = [];
        if (typeof sources == "object") {
            for (var x = 0; x < width; x += 1000) {
                var column = [];
                for (var y = 0; y < height; y += 1000) {
                    if (sources[x / 1000][y / 1000] == "") {
                        column.push(new GameMap(game, x + 500, y + 500, 1000, 1000, squareSize));
                    } else {
                        column.push(new GameMap(game, x + 500, y + 500, 1000, 1000, squareSize, sources[x / 1000][y / 1000]));
                    }
                }
                this.#maps.push(column);
            }
        } else {
            for (var x = 0; x < width; x += 1000) {
                var column = []
                for (var y = 0; y < height; y += 1000) {
                    column.push(new GameMap(game, x + 500, y + 500, 1000, 1000, squareSize));
                }
                this.#maps.push(column);
            }
        }
    }

    // standard getters and setters
    getMaps() {
        return this.#maps;
    }

    // real methods
    /**
     * moves every map in the MapPack
     * 
     * @param {Number} xChange - change to the x coords
     * @param {Number} yChange - change to the y coords
     */
    moveMap(xChange, yChange) {
        super.moveMap(xChange, yChange);
        this.getMaps().forEach(function(column) {
            column.forEach(function(map) {
                map.moveMap(xChange, yChange);
            });
        });
    }

    /**
     * returns a list of maps in the vicinity of the Agar
     * 
     * @param {Agar} agar -
     * @param {Number} scale - 
     * 
     * @return - a list of maps within a certain range of the Agar
     */
    getLocalMaps(agent, scale) {
        var localMaps = [];

        var xValue = Math.floor(agent.getXCoord() / 1000);
        var yValue = Math.floor(agent.getYCoord() / 1000);

        var counter = 1;
        var numOfMaps = 3;
        while ((2.1 / numOfMaps) > scale) {
            numOfMaps += 2;
            counter++;
        }

        for (var x = 0 - counter; x < counter + 1; x++) {
            var mapX = xValue + x;
            if (mapX > -1 && mapX < (this.getWidth() / 1000)) {
                var column = [];
                for (var y = 0 - counter; y < counter + 1; y++) {
                    var mapY = yValue + y;
                    if (mapY > -1 && mapY < (this.getHeight() / 1000)) {
                        column.push(this.getMaps()[mapX][mapY]);
                    }
                }
                localMaps.push(column);
            }
        }
        return localMaps;
    }

    /**
     * draws all of the maps in the vicinity of the player agar
     * 
     * @param {Number} scale - the scale at which the maps will be drawn
     */
    draw(scale) {
        var localMaps = this.getLocalMaps(this.getGame().getPlayer(), scale);
        localMaps.forEach(function(column) {
            column.forEach(function(map) {
                map.draw(scale);
            });
        });
    }
}