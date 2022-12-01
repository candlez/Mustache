import AnimatedGame from '../common/AnimatedGame.js';
import Agar from './Agar.js'
import AssetContainer from '../common/AssetContainer.js';
import MapPack from '../common/MapPack.js';

export default class AgarioGame extends AnimatedGame {
    /**
     * initializes a Game object
     * 
     * @param {Number} width 
     * @param {Width} height 
     */
    constructor(width, height) {
        super(width, height);
    }

    /**
     * sorts the agars by mass
     * 
     * need to consider the case when masses are equal
     */
    sortAgarsByMass() {
        this.agents.sort(function(a, b) {
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
        this.agents.forEach(function (agar, index, agars) {
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
        if (this.getPlayer().getMass() * this.getScale() > 100) {
            var targetScale = Math.round((100 / this.getPlayer().getMass()) * 1000) / 1000;
            var diff = this.getScale() - targetScale;
            this.setScale(Math.round((this.scale - (diff * rate)) * 1000) / 1000);
        } else if (this.playerAgent.mass * this.scale < 100) {
            var targetScale = Math.round((100 / this.playerAgent.mass) * 1000) / 1000;
            var diff = targetScale - this.scale;
            this.setScale(Math.round((this.scale + (diff * rate)) * 1000) / 1000);
        }
    }

    /**
     * updates posiiton data so the objects can be drawn
     * 
     * also updates scale data
     */
    updatePositionData() {
        var change = this.interpretKeys();
        this.playerAgar.moveAgar(change.x, change.y)
    }    

    /**
     * draws a frame based on currently available data
     */
    animateFrame() {
        this.updatePositionData(); // update the positions of objects
        this.sortAgarsByMass(); // sort the agars by mass in descending order
        this.eatCheck(); // check if any agars are eating each other
        this.adjustScale(); // set the scale at which the objects will be drawn
        super.animateFrame();
    }

    /**
     * deals with all tasks involved in running the game
     */
    static playGame(width, height) {
        // hide start screen ** needs to be moved somewhere else
        document.getElementById("paragraph").style.display = "none";
        document.getElementById("pressMeTesting").style.display = "none";

        var game = new AgarioGame(width, height);

        // start game in data
        game.gameState = true;

        // creates an AssetContainer
        game.setAssetContainer(new AssetContainer());
        game.assetContainer.addAsset('thanos', "./assets/thanos_background.jpg", 500, 500);
        game.assetContainer.addAsset('thanos_armor', "./assets/thanos_armor.jpg", 500, 500);

        // add player agar
        game.addAgar(new Agar("player", this, true, 5000, 5000, 100, "blue", './assets/mustachio.png'));

        // create map
        game.setMap(new MapPack(this, 5000, 5000, 10000, 10000, 100,
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
            ] // this NEEDS to be fixed
        ));

        // create minimap
        game.createMiniMap(350, 350, './assets/thanos_armor.jpg');
        game.miniMap.showContainer();
        game.miniMap.drawMap();

        // add enemy agars
        game.addAgar(new Agar("enemy", this, false, 4500, 4500, 50, "green", './assets/thanos_armor.jpg'));
        game.addAgar(new Agar("enemy2", this, false, 5500, 5500, 50, "red"));
        game.addAgar(new Agar("enemy3", this, false, 500, 4500, 150, "purple"));
        game.addAgar(new Agar("enemy4", this, false, 7500, 7500, 200, "orange"));
        game.addAgar(new Agar("enemy5", this, false, 5000, 2500, 250, "yellow"));
        game.addAgar(new Agar("enemy6", this, false, 7500, 2000, 300, "black"));

        // start the animation cycle
        requestAnimationFrame(animationLoop);

        // start tracking wasd button presses
        startWASD();
    }
}