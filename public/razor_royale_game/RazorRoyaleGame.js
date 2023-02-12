import AnimatedGame from '../common/AnimatedGame.js';
import GameObject from '../common/GameObject.js';
import Mustache from '../razor_royale_game/Mustache.js';
import Wall from './Wall.js'
import AssetContainer from '../common/AssetContainer.js';
import SpawnZone from '../common/SpawnZone.js';
import MapPack from '../common/MapPack.js';
import GameMap from '../common/GameMap.js';
import MiniMap from '../common/MiniMap.js';
import MovementKeyLoggerContainer from '../common/MovementKeyLoggerContainer.js';
import TestingKeyLoggerContainer from '../common/TestingKeyLoggerContainer.js';

export default class RazorRoyaleGame extends AnimatedGame {

    /**
     * initializes a new RazorRoyaleGame object
     * 
     * @param {Number} width - the width of the canvas
     * @param {Number} height - the height of the canvas
     */
    constructor(width, height) {
        super(width, height);
    }

    spawnPlayer(id, color) {
        var spawnCoords = this.getPlayerSpawnZone().generateSpawnCoords();
        this.addAgent(Mustache.createNewlySpawned(id, this, true, spawnCoords.x, spawnCoords.y, color));
    }

    addObjectFromData(key, object) { // update this as new types of objects are added
        this.requestObjectProperties(key);
        if (object.type == "wall") {
            var wall = Wall.createPropertyless(key, this, object.x, object.y);
            this.addObject(wall);
            this.getBlocking().push(wall);
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
        }, {
            opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
            animation: {
                type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE,
            }
        }))
        
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

        // game.addObject(new Wall("firstWall", game, 5000, 5000, 200, 200, "crimson"));
        // game.addObject(new Wall("secondWall", game, 5000, 4800, 200, 200, "crimson"));
        // game.addObject(new Wall("thirdWall", game, 5000, 4600, 200, 200, "crimson"));
        // game.addObject(new Wall("fourthWall", game, 5000, 4400, 200, 200, "crimson"));
        // game.addObject(new Wall("fifthWall", game, 5000, 4200, 200, 200, "crimson"));

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

        game.startGame();
    }
}