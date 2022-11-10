import GameMap from './GameMap.js'
import Agar from './Agar.js'
import {animationLoop} from './AgarGame.js'
import MapPack from './MapPack.js'
import MiniMap from './MiniMap.js';
import AssetContainer from './AssetContainer.js';

export default class Game {
    /**
     * 
     * @param {Number} width 
     * @param {Width} height 
     */
    constructor(width, height) {
        // takes parameters
        this.width = width;
        this.height = height;

        // creates a canvas with parameters, adds it to body
        this.canvas = document.createElement('canvas');
        this.canvas.id = "playSpace";
        document.body.appendChild(this.canvas);

        this.canvas.width = width;
        this.canvas.height = height;

        // creates context
        this.ctx = this.canvas.getContext('2d');

        // fields
        this.gameState = false;
        this.map = null;
        this.miniMap = null;
        this.assetContainer = null;
        this.agars = [];
        this.playerAgar = null;
        this.scale = 1;
    }

    /**
     * sets the map to a map object
     * 
     * @param {GameMap} map - GameMap object on which the game is being played
     */
    setMap(map) {
        if (map instanceof GameMap) {
            this.map = map;
        }
    }

    /**
     * adds an Agar object to the list
     * 
     * @param
     */
    addAgar(agar) {
        if (agar instanceof Agar) {
            this.agars.push(agar);
        }
        if (agar.isPlayerAgar) {
            this.playerAgar = agar;
        }
    }

    /**
     * removes all the agars with a given id
     * 
     * @param
     */
    removeAgar(id) {
        var indices = [];
        this.agars.forEach(function(agar, index) {
            if (agar.id == id) {
                indices.push(index);
                if (agar.isPlayerAgar) {
                    agar.game.playerAgar = null;
                }
            }
        })
        for (var i = indices.length - 1; i > -1; i--) {
            this.agars.splice(indices[i], 1);
        }
    }

    /**
     * sorts the agars by mass
     * 
     * need to consider the case when masses are equal
     */
    sortAgarsByMass() {
        this.agars.sort(function(a, b) {
            return b.mass - a.mass;
        })
    }

    /**
     * checks if two agars are overlapping enough for 
     * one to eat the other
     * 
     * @param
     * 
     * @param
     */
    checkIfEaten(bigAgar, smallAgar) {
        var xDiff = Math.abs(bigAgar.xCoord - smallAgar.xCoord);
        var yDiff = Math.abs(bigAgar.yCoord - smallAgar.yCoord);
        var combinedRadii = bigAgar.mass + smallAgar.mass;
        if (Math.ceil(combinedRadii / 2) > xDiff + yDiff) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * runs through all of the agars and checks if any of them are close enough to
     * for the bigger one to eat the smaller on
     */
    eatCheck() {
        this.agars.forEach(function (agar, index, agars) {
            for (var i = index; i < agars.length - 1; i++) {
                if (agar.mass == agars[i + 1].mass) {
                    // intentionally blank
                } else if (agar.game.checkIfEaten(agar, agars[i + 1])) {
                    agar.eatAgar(agars[i + 1]);
                    break;
                }
            }
        });
    }
    
    /**
     * need a universal scale
     * a player agar should always have canvas radius 100
     * radius = mass * scale
     * 100 = player mass * scale
     * scale = 100 / player mass
     */
    adjustScale() {
        var rate = .05
        if (this.playerAgar.mass * this.scale > 100) {
            var targetScale = Math.round((100 / this.playerAgar.mass) * 1000) / 1000;
            var diff = this.scale - targetScale;
            this.scale -= diff * rate;
            this.scale = Math.round(this.scale * 1000) / 1000
        } else if (this.playerAgar.mass * this.scale < 100) {
            var targetScale = Math.round((100 / this.playerAgar.mass) * 1000) / 1000;
            var diff = targetScale - this.scale;
            this.scale += diff * rate;
            this.scale = Math.round(this.scale * 1000) / 1000;
        }
    }

    /**
     * calculates the change to x and y values of objects being moved
     */
    findChange() {
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
     * updates posiiton data so the objects can be drawn
     * 
     * also updates scale data
     */
    updatePositionData() {
        var change = this.findChange();
        
        // update playerAgar
        this.playerAgar.moveAgar(change.x, change.y)
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
     * draws all objects on the play space
     */
    drawObjects() {
        this.miniMap.clearCanvas();
        this.miniMap.drawMap();
        this.miniMap.drawAgar();

        this.map.drawMap(this.scale);

        for (var i = this.agars.length; i > 0; i--) {
            this.agars[i - 1].drawAgar(this.scale);
        }
    }

    /**
     * gets the width and height of a page for elements that need
     * to be scaled based on window size
     * 
     * @returns - an array of the page width and height
     */
    getPageDimensions() {
        return [window.innerWidth, window.innerHieght];
    }

    /**
     * creates a MiniMap object and sets the miniMap field
     * 
     * @param {Number} width - the width of the MiniMap
     * @param {Number} height - the height of the MiniMap
     */
    createMiniMap(width, height, source) {
        this.miniMap = new MiniMap(this, this.map, this.playerAgar, width, height, source);
    }

    setAssetContainer(newAssetContainer) {
        if (newAssetContainer instanceof AssetContainer) {
            this.assetContainer = newAssetContainer;
        }
    }

    /**
     * draws a frame based on currently available data
     */
    animateFrame() {
        // erase everything from the previous frame
        this.clearPlaySpace();

        // update the positions of objects
        this.updatePositionData();

        // sort the agars by mass in descending order
        this.sortAgarsByMass();

        // check if any agars are eating each other
        this.eatCheck();

        // set the scale at which the objects will be drawn
        this.adjustScale();

        // draw the objects
        this.drawObjects();
        // this.assetContainer.drawAsset(this.ctx, 'thanos', 750, 750, 200, 200);
        // this.assetContainer.drawAsset(this.ctx, 'thanos_armor', 1250, 1250, 200, 200);

        // start over
        if (this.gameState) {
            requestAnimationFrame(animationLoop);
        }
    }

    /**
     * deals with all tasks involved in running the game
     */
    playGame() {
        // hide start screen
        document.getElementById("paragraph").style.display = "none";
        document.getElementById("pressMeTesting").style.display = "none";

        // start game in data
        this.gameState = true;

        // creates an AssetContainer
        this.setAssetContainer(new AssetContainer());
        this.assetContainer.addAsset('thanos', "./assets/thanos_background.jpg", 500, 500);
        this.assetContainer.addAsset('thanos_armor', "./assets/thanos_armor.jpg", 500, 500);

        // add player agar
        this.addAgar(new Agar("player", this, true, 5000, 5000, 100, "blue"));

        // create map
        this.setMap(new MapPack(this, 5000, 5000, 10000, 10000, 100,
            [
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "./assets/thanos_armor.jpg", "", "", "", "", "", ""],
                ["", "", "", "", "./assets/thanos_background.jpg", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", "", ""]
            ]
        ));

        // create minimap
        this.createMiniMap(350, 350, './assets/thanos_armor.jpg');
        this.miniMap.showContainer();
        this.miniMap.drawMap();

        // add enemy agars
        this.addAgar(new Agar("enemy", this, false, 4500, 4500, 50, "green"));
        this.addAgar(new Agar("enemy2", this, false, 5500, 5500, 50, "red"));
        this.addAgar(new Agar("enemy3", this, false, 500, 4500, 150, "purple"));
        this.addAgar(new Agar("enemy4", this, false, 7500, 7500, 200, "orange"));
        this.addAgar(new Agar("enemy5", this, false, 5000, 2500, 250, "yellow"));
        this.addAgar(new Agar("enemy6", this, false, 7500, 2000, 300, "black"));

        // start the animation cycle
        requestAnimationFrame(animationLoop);

        // start tracking wasd button presses
        startWASD();
    }
}