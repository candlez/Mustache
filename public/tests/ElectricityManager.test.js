/**
 * @jest-environment jsdom
 */
import ElectricityManager from "../razor_royale_game/ElectricityManager.js";
import RazorRoyaleGame from './../razor_royale_game/RazorRoyaleGame.js';
import GameMap from "../common/GameMap.js";

describe('testing for the ElectricityManager class', () => {
    var game;
    var map; 
    var manager;

    beforeEach(() => {
        game = null;
        map = new GameMap(game, 1000, 1000, 2000, {
            animation: {
                type: GameMap.PROPERTIES.ANIMATION.TYPE.SQUARE,
                squareSize: 200,
                squaresPerSide: 10,
                lineColor: "silver",
                backgroundColor: "white"
            }
        })
        manager = new ElectricityManager(game, map, 10);
    })

    //-------------------------------------------------------------------------------
    test('test that the constructor works', () => {
        expect(manager.getGame()).toMatchObject(game);
        expect(manager.getMap()).toMatchObject(map);
        expect(manager.getEletricity().length).toBe(10);
    })
})