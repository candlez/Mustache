import AnimatedGame from '../common/AnimatedGame.js';
import Agar from './Agar.js'
import AssetContainer from '../common/AssetContainer.js';
import MapPack from '../common/MapPack.js';
import MiniMap from '../common/MiniMap.js';
import GameMap from '../common/GameMap.js';
import MovementKeyLogger from '../common/MovementKeyLogger.js';
import GameObject from '../common/GameObject.js';
import SpawnZone from '../common/SpawnZone.js';

/**
 * 
 */
export default class AgarioGame extends AnimatedGame {
    // fields
    #sortedAgars;

    // static fields
    static SPAWN_PROPERTIES = {
        opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
        animation: {
            type: GameObject.PROPERTIES.ANIMATION.TYPE.CIRCLE,
            radius: 100,
        }
    }
    
    /**
     * initializes a Game object
     * 
     * @param {Number} width 
     * @param {Width} height 
     */
    constructor(width, height) {
        super(width, height);
        this.#sortedAgars = [];
    }

    // getters and setters
    setSortedAgars(newSortedAgars) {
        this.#sortedAgars = newSortedAgars;
    }
    getSortedAgars() {
        return this.#sortedAgars;
    }

    // methods
    addAgent(agent) {
        this.getSortedAgars().push(agent);
        super.addAgent(agent);
    }

    removeAgent(id) {
        var newSortedAgars = this.getSortedAgars();
        for (var i = newSortedAgars.length - 1; i >= 0; i--) {
            if (newSortedAgars[i].getID() == id) {
                newSortedAgars.splice(i, 1);
            }
        }
        this.setSortedAgars(newSortedAgars);
        super.removeAgent(id);
    }

    /**
     * sorts the agars by mass
     * 
     * need to consider the case when masses are equal
     */
    sortAgarsByMass() {
        this.getSortedAgars().sort(function(a, b) {
            return b.getMass() - a.getMass();
        });
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
        var xDiff = Math.abs(bigAgar.getXCoord() - smallAgar.getXCoord());
        var yDiff = Math.abs(bigAgar.getYCoord() - smallAgar.getYCoord());
        var combinedRadii = bigAgar.getMass() + smallAgar.getMass();
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
    eatCheck() { // wont work with new agents
        this.getAgents().forEach(function (agar, index, agars) {
            for (var i = index; i < agars.length - 1; i++) {
                if (agar.getMass() != agars[i + 1].getMass()) {
                    if (agar.getGame().checkIfEaten(agar, agars[i + 1])) {
                        console.log("eaten!")
                        agar.eatAgar(agars[i + 1]);
                        break;
                    }
                }
            }
        });
    }

    addAgentFromData(key, agent) {
        this.addAgent(new Agar(key, this, false, agent.x, agent.y, agent.mass, { // properties
            animation: {
                type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE,
            },
            opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE
        }))
    }

    generateSpawnProperties(color) {
        var properties = AgarioGame.SPAWN_PROPERTIES;
        properties.animation.color = color;
        return properties;
    }

    spawnPlayer(id, color) {
        var spawnCoords = this.getPlayerSpawnZone().generateSpawnCoords();
        var newAgar = new Agar(id, this, true, spawnCoords.x, spawnCoords.y, 100, this.generateSpawnProperties(color))
        this.addAgent(newAgar);
    }

    sendPlayerDataToServer() {
        const player = this.getPlayer();
        var data = {
            id: player.getID(),
            x: player.getXCoord(),
            y: player.getYCoord(),
            mass: player.getMass(),
            properties: this.generateSpawnProperties(player.getColor())
        }
        this.getSocket().emit("playerSpawned", data);
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
            this.setScale(Math.round((this.getScale() - (diff * rate)) * 1000) / 1000);
        } else if (this.getPlayer().getMass() * this.getScale() < 100) {
            var targetScale = Math.round((100 / this.getPlayer().getMass()) * 1000) / 1000;
            var diff = targetScale - this.getScale();
            this.setScale(Math.round((this.getScale() + (diff * rate)) * 1000) / 1000);
        }
    }    

    /**
     * draws a frame based on currently available data
     */
    animateFrame() {
        this.sortAgarsByMass(); // sort the agars by mass in descending order
        this.eatCheck(); // check if any agars are eating each other
        super.animateFrame();
    }

    /**
     * deals with all tasks involved in running the game
     */
    static playGame(width, height) {
        var game = new AgarioGame(width, height);

        game.beginLoading();

        // get player name and color from previous page
        var playerName = sessionStorage.getItem("playerName");
        var playerColor = sessionStorage.getItem("playerColor");

        // creates an AssetContainer
        game.setAssetContainer(new AssetContainer());

        // creates a SpawnZone for players
        game.setPlayerSpawnZone(new SpawnZone("playerSpawnZone", game, 5000, 5000, {
            left: 1000, top: 1000, right: 9000, bottom: 9000
        }, {
            opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
            animation: {
                type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE,
            }
        }))

        // add player agar
        game.spawnPlayer(playerName, playerColor);

        // create map
        game.setMap(new MapPack(game, 5000, 5000, 10000, 10000,
            { // properties
                animation: {
                    squareSize: 100,
                    backgroundColor: "white",
                    lineColor: "silver"
                }
            },
            [
                {x: 4, y: 4, source: "../assets/thanos_armor.jpg"},
                {x: 5, y: 5, source: "../assets/thanos_background.jpg"}
            ] 
        ));
        
        // create minimap
        game.setMiniMap(new MiniMap(game, game.getMap(), game.getPlayer(), 350, { // properties
            animation: {
                type: GameMap.PROPERTIES.ANIMATION.TYPE.IMAGE,
                source: '../assets/thanos_armor.jpg',
                backgroundColor: "white"
            }
        }));

        // generate new id
        game.waitForPlayerID();
        game.generatePlayerID();

        // console.log("(4500, 4500) legal point?", game.isLegalPoint(4500, 4500));
        // console.log("(5500, 5500) legal point?", game.isLegalPoint(5500, 5500));
        // console.log("(10001, 5000) legal point?", game.isLegalPoint(10001, 5000));

        // start tracking wasd button presses
        game.setMovementKeyLogger(new MovementKeyLogger());

        // begin recieving server updates
        game.waitForServerUpdates();
        game.waitForAgentProperties();
        game.waitForPlayerDisconnects();
        

        // get initial data
        game.requestServerData(true);

        // start the animation cycle
        game.startGame();
    }
}