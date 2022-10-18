import GameMap from './GameMap.js'
import Agar from './Agar.js'
import {animationLoop} from './AgarGame.js'

export default class Game {
    constructor(width, height) {
        // takes parameters
        this.width = width;
        this.height = height;

        // creates a canvas with parameters, adds it to body
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);

        this.canvas.width = width;
        this.canvas.height = height;

        // creates context
        this.ctx = this.canvas.getContext('2d');

        // fields
        this.gameState = false;
        this.map = null;
        this.agars = [];
    }

    /**
     * sets the map to a map object
     * 
     * @param 
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
            return a.mass - b.mass;
        })
    }

    /**
     * checks if two agars are overlapping enough for 
     * one to eat the other
     */
    checkIfEaten(bigAgar, smallAgar) {
        var xDiff = abs(bigAgar.xCoord - smallAgar.xCoord);
        var yDiff = abs(bigAgar.yCoord - smallAgar.yCoord);
        var combinedRadii = bigAgar.mass + smallAgar.mass;
        if (combinedRadii > xDiff + yDiff) {
            console.log('whats up')
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     */
    eatCheck() {
        
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
     */
    updateData() {
        var change = this.findChange();
        
        // the minus in these represents the fact that it should
        // go the opposite way

        // update the map
        this.map.xCoord -= change.x;
        this.map.yCoord -= change.y;

        // update agars
        this.agars.forEach(function(agar, index) {
            if (agar.id != "player") {
                agar.xCoord -= change.x;
                agar.yCoord -= change.y;
            }
        })
        
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
        this.map.drawMap();
        this.agars.forEach(function(agar) {
            agar.drawAgar();
        });
    }

    /**
     * draws a frame based on currently available data
     */
    animateFrame() {
        this.clearPlaySpace();
        this.updateData();
        this.sortAgarsByMass();
        this.eatCheck();
        this.drawObjects();
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

        // create map
        var map = new GameMap(0, 0, 2000, 2000, this.ctx)
        this.setMap(map);
        // this.map.drawMap();

        // add player agar
        var player = new Agar("player", this,1000, 1000, 100, "blue", this.ctx)
        this.addAgar(player);

        // add enemy agar
        var enemy = new Agar("enemy", this, 1250, 750, 200, "green", this.ctx)
        this.addAgar(enemy);

        // start the animation cycle
        requestAnimationFrame(animationLoop);

        // start tracking wasd button presses
        startWASD();
    }
}