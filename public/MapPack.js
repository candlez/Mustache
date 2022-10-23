import GameMap from './GameMap.js'

export default class MapPack extends GameMap {
    /**
     * 
     * @param {Game} game -
     * @param {xCoord} xCoord -
     * @param {yCoord} yCoord -
     * @param {Number} width - width in absolute pixels (needs to be divisible by 1000)
     * @param {Number} height - height in absolute pixels (needs to be divisible by 1000)
     */
    constructor(game, xCoord, yCoord, width, height) {
        super(game, xCoord, yCoord, width, height);

        this.maps = [];
        for (var x = 0; x < width; x += 1000) {
            var column = []
            for (var y = 0; y < height; y += 1000) {
                column.push(new GameMap(game, x + 500, y + 500, 1000, 1000));
            }
            this.maps.push(column);
        }
    }

    /**
     * moves every map in the MapPack
     * 
     * @param {Number} xChange - change to the x coords
     * @param {Number} yChange - change to the y coords
     */
    moveMap(xChange, yChange) {
        super.moveMap(xChange, yChange);
        this.maps.forEach(function(column) {
            column.forEach(function(map) {
                map.moveMap(xChange, yChange);
            });
        });
    }

    /**
     * returns a list of maps in the vicinity that should be drawn
     * 
     * @param {Agar} agar -
     * @param {Number} scale - 
     * 
     * @return 
     */
    getLocalMaps(agar, scale) {
        var localMaps = [];

        var xValue = Math.floor(agar.xCoord / 1000);
        var yValue = Math.floor(agar.yCoord / 1000);

        var counter = 1;
        var numOfMaps = 3;
        while ((2 / numOfMaps) > scale) {
            numOfMaps += 2;
            counter++;
        }

        for (var x = 0 - counter; x < counter + 1; x++) {
            var mapX = xValue + x;
            if (mapX > -1 && mapX < (this.width / 1000)) {
                var column = [];
                for (var y = 0 - counter; y < counter + 1; y++) {
                    var mapY = yValue + y;
                    if (mapY > -1 && mapY < (this.height / 1000)) {
                        column.push(this.maps[mapX][mapY]);
                    }
                }
                localMaps.push(column);
            }
        }

        return localMaps;
    }

    /**
     * 
     * @param {Number} scale 
     */
    drawMap(scale) {
        var localMaps = this.getLocalMaps(this.game.playerAgar, scale);

        localMaps.forEach(function(column) {
            column.forEach(function(map) {
                map.drawMap(scale);
            });
        });
    }
}