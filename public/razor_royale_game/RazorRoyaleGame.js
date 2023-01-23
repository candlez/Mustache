import AnimatedGame from '../common/AnimatedGame.js';
import GameObject from '../common/GameObject.js';
import Mustache from '../razor_royale_game/Mustache.js';
import AssetContainer from '../common/AssetContainer.js';
import SpawnZone from '../common/SpawnZone.js';
import MapPack from '../common/MapPack.js';
import GameMap from '../common/GameMap.js';
import MiniMap from '../common/MiniMap.js';
import MovementKeyLogger from '../common/MovementKeyLogger.js';

export default class RazorRoyaleGame extends AnimatedGame {

    static SPAWN_PROPERTIES = {
        opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
        animation: {
            type: GameObject.PROPERTIES.ANIMATION.TYPE.RECTANGLE,
            width: 200,
            height: 200,
        }
    }

    /**
     * initializes a new RazorRoyaleGame object
     * 
     * @param {Number} width - the width of the canvas
     * @param {Number} height - the height of the canvas
     */
    constructor(width, height) {
        super(width, height);
    }

    generateSpawnProperties(color) {
        var properties = RazorRoyaleGame.SPAWN_PROPERTIES;
        properties.animation.color = color;
        return properties;
    }

    spawnPlayer(id, color) {
        var spawnCoords = this.getPlayerSpawnZone().generateSpawnCoords();
        var newPlayer = new Mustache(id, this, true, spawnCoords.x, spawnCoords.y, this.generateSpawnProperties(color));
        this.addAgent(newPlayer);
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
                    backgroundColor: "white",
                    lineColor: "silver"
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
                backgroundColor: "white"
            }
        }));

        game.waitForPlayerID();
        game.generatePlayerID();

        game.setMovementKeyLogger(new MovementKeyLogger());

        game.waitForServerUpdates();
        game.waitForAgentProperties();
        game.waitForPlayerDisconnects();

        game.requestServerData(true);

        game.startGame();
    }
}