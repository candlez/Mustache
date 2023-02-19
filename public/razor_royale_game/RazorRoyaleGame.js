import AnimatedGame from '../common/AnimatedGame.js';
import GameObject from '../common/GameObject.js';
import Mustache from '../razor_royale_game/Mustache.js';
import Wall from './Wall.js'
import AssetContainer from '../common/AssetContainer.js';
import SpawnZone from '../common/SpawnZone.js';
import MapPack from '../common/MapPack.js';
import GameMap from '../common/GameMap.js';
import MiniMap from '../common/MiniMap.js';
import ElectricityManager from './ElectricityManager.js';
import MovementKeyLoggerContainer from '../common/MovementKeyLoggerContainer.js';
import TestingKeyLoggerContainer from '../common/TestingKeyLoggerContainer.js';
import Electricity from './Electricity.js';

export default class RazorRoyaleGame extends AnimatedGame {
    // fields
    #electricityManagers

    /**
     * initializes a new RazorRoyaleGame object
     * 
     * @param {Number} width - the width of the canvas
     * @param {Number} height - the height of the canvas
     */
    constructor(width, height) {
        super(width, height);

        this.#electricityManagers = [];
    }

    // getters and setters
    getElectricityManagers() {
        return this.#electricityManagers;
    }

    // methods
    intrepretTestingKeys() {
        const loggers = this.getTestingKeyLogger().getKeyLoggers();
        if (loggers.get("9").getKeyDown()) {
            this.getElectricityManagers()[0].fill();
        }
        if (loggers.get("8").getKeyDown()) {
            this.spawnElectricity(1);
        }
        if (loggers.get("7").getKeyDown()) {
            this.spawnElectricity(5);
        }
        if (loggers.get("6").getKeyDown()) {
            console.log("6 was pressed");
        }
        if (loggers.get("5").getKeyDown()) {
            console.log("5 was pressed");
        }
    }

    spawnElectricity(count) {
        if (count < 1) {
            throw new RangeError("cant spawn less than 1 electricity");
        }
        while (count > 0) {
            var electricityManagers = this.getElectricityManagers()
            var index = Math.floor(Math.random() * electricityManagers.length);
            electricityManagers[index].spawnElectricity(1);
            count--;
        }
    }

    spawnPlayer(id, color) {
        var spawnCoords = this.getPlayerSpawnZone().generateSpawnCoords();
        this.addAgent(Mustache.createNewlySpawned(id, this, true, spawnCoords.x, spawnCoords.y, color));
    }

    addObjectFromData(key, object) { // update this as new types of objects are added
        if (object.type == "wall") {
            this.requestObjectProperties(key);
            var wall = Wall.createPropertyless(key, this, object.x, object.y);
            this.addObject(wall);
        } else if (object.type == "electricityManager") {
            var electricityManager = new ElectricityManager(
                key, 
                this, 
                object.x, 
                object.y, 
                object.bounds, 
                object.max,
                ElectricityManager.DEFAULT_PROPERTIES
            );
            this.addObject(electricityManager);
            this.getElectricityManagers().push(electricityManager);
        } else {
            console.log("unrecognized GameObject type")
        }
    }

    addAgentFromData(key, agent) {
        this.requestAgentProperties(key);
        this.addAgent(Mustache.createPropertyless(key, this, false, agent.x, agent.y));
    }

    /**
     * 
     */
    static playGame(width, height) {
        const game = new RazorRoyaleGame(width, height);

        game.beginLoading();

        var playerName = sessionStorage.getItem("playerName");
        var playerColor = sessionStorage.getItem("playerColor");

        game.setAssetContainer(new AssetContainer());

        game.setPlayerSpawnZone(new SpawnZone("playerSpawnZone", game, 5000, 5000, {
            left: 1000, top: 1000, right: 9000, bottom: 9000
        }, SpawnZone.DEFAULT_PROPERTIES))
        
        game.spawnPlayer(playerName, playerColor);

        game.setMap(new MapPack(game, 5000, 5000, 10000, 10000,
            { // properties
                animation: {
                    squareSize: 100,
                    backgroundColor: "rgb(15, 15, 15)",
                    lineColor: "gainsboro"
                }
            },
            [
                {x: 4, y: 4, source: "../assets/thanos_armor.jpg"},
                {x: 5, y: 5, source: "../assets/thanos_background.jpg"}
            ] 
        ));

        game.setMiniMap(new MiniMap(game, game.getMap(), game.getPlayer(), 350, { // properties
            animation: {
                type: GameMap.PROPERTIES.ANIMATION.TYPE.IMAGE,
                source: '../assets/thanos_armor.jpg',
                backgroundColor: "moccasin"
            }
        }));

        game.waitForPlayerID();
        game.generatePlayerID();

        game.setMovementKeyLogger(new MovementKeyLoggerContainer());
        game.setTestingKeyLogger(new TestingKeyLoggerContainer());

        game.waitForServerUpdates();
        game.waitForAgentProperties();
        game.waitForObjectProperties();
        game.waitForPlayerDisconnects();

        game.requestServerData(true);

        // var electric = game.getMap().getMaps()[4][4]
        // var manager = new ElectricityManager(game, electric, 10);
        // manager.fill();
        
        // game.addObject(new Electricity("testing", game, 2000, 2000));

        game.startGame();
    }
}