/**
 * @jest-environment jsdom
 */
import Game from '../Game.js';
import Agar from '../Agar.js';
import MapPack from '../MapPack.js';

describe('unit testing for the MapPack class', () => {
    var game;
    var mapPack;
    var player;

    beforeEach(() => {
        game = new Game(2000, 2000);
        mapPack = new MapPack(game, 5000, 5000, 10000, 10000);
        game.setMap(mapPack) 
        player = new Agar("player", game, true, 5000, 5000, 100, "blue");
        game.addAgar(player);
    });

    //-------------------------------------------------------------------------------
    test('testing the set up', () => {
        expect(mapPack.width).toBe(10000);
        expect(mapPack.height).toBe(10000);
        expect(mapPack.game).toBe(game);
        mapPack.maps.forEach(function(column) {
            column.forEach(function(map) {
                expect(map.width).toBe(1000);
                expect(map.height).toBe(1000);
            });
        });
        expect(mapPack.maps[0][0].xCoord).toBe(500);
        expect(mapPack.maps[0][0].yCoord).toBe(500);
        expect(mapPack.maps[mapPack.maps.length - 1][mapPack.maps[0].length - 1].xCoord).toBe(9500);
        expect(mapPack.maps[mapPack.maps.length - 1][mapPack.maps[0].length - 1].yCoord).toBe(9500);
        expect(game.map).toBe(mapPack);
    });

    //-------------------------------------------------------------------------------
    describe('testing the moveMap method', () => {
        test('with positive values', () => {
            mapPack.moveMap(500, 500);
            expect(mapPack.xCoord).toBe(5500);
            expect(mapPack.yCoord).toBe(5500);
            expect(mapPack.maps[0][0].xCoord).toBe(1000);
            expect(mapPack.maps[0][0].yCoord).toBe(1000);
            expect(mapPack.maps[mapPack.maps.length - 1][mapPack.maps[0].length - 1].xCoord).toBe(10000);
            expect(mapPack.maps[mapPack.maps.length - 1][mapPack.maps[0].length - 1].yCoord).toBe(10000);
        });

        test('with negative values', () => {
            mapPack.moveMap(-500, -500);
            expect(mapPack.xCoord).toBe(4500);
            expect(mapPack.yCoord).toBe(4500);
            expect(mapPack.maps[0][0].xCoord).toBe(0);
            expect(mapPack.maps[0][0].yCoord).toBe(0);
            expect(mapPack.maps[mapPack.maps.length - 1][mapPack.maps[0].length - 1].xCoord).toBe(9000);
            expect(mapPack.maps[mapPack.maps.length - 1][mapPack.maps[0].length - 1].yCoord).toBe(9000);
        });
    });

    //-------------------------------------------------------------------------------
    describe('testing the getLocalMaps method', () => {
        test('with a scale of 1', () => {
            var localMaps = mapPack.getLocalMaps(player, 1);
            expect(localMaps.length).toBe(3);
            expect(localMaps[0].length).toBe(3);
            expect(localMaps[0][0].xCoord).toBe(4500);
            expect(localMaps[0][0].yCoord).toBe(4500);
            expect(localMaps[1][1].xCoord).toBe(5500);
            expect(localMaps[1][1].yCoord).toBe(5500);
            expect(localMaps[2][2].xCoord).toBe(6500);
            expect(localMaps[2][2].yCoord).toBe(6500);
        });

        test('with a scale of .5', () => {
            var localMaps = mapPack.getLocalMaps(player, .5);
            expect(localMaps.length).toBe(5);
            expect(localMaps[0].length).toBe(5);
            expect(localMaps[0][0].xCoord).toBe(3500);
            expect(localMaps[0][0].yCoord).toBe(3500);
            expect(localMaps[2][2].xCoord).toBe(5500);
            expect(localMaps[2][2].yCoord).toBe(5500);
            expect(localMaps[4][4].xCoord).toBe(7500);
            expect(localMaps[4][4].yCoord).toBe(7500);
        });

        test('with a scale of 2', () => {
            var localMaps = mapPack.getLocalMaps(player, 2);
            expect(localMaps.length).toBe(3);
            expect(localMaps[0].length).toBe(3);
            expect(localMaps[0][0].xCoord).toBe(4500);
            expect(localMaps[0][0].yCoord).toBe(4500);
            expect(localMaps[1][1].xCoord).toBe(5500);
            expect(localMaps[1][1].yCoord).toBe(5500);
            expect(localMaps[2][2].xCoord).toBe(6500);
            expect(localMaps[2][2].yCoord).toBe(6500);
        });
    });
});