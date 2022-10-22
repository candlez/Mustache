/**
 * @jest-environment jsdom
 */
import Game from './Game.js';
import GameMap from './GameMap.js';
import Agar from './Agar.js';

 describe('unit testing for the GameMap class', () => {
    var map;
    var game;
    var player;

    beforeEach(() => {
        game = new Game(2000, 2000);
        map = new GameMap(game, 2500, 2500, 5000, 5000, game.ctx);
        player = new Agar('player', game, true, 1000, 1000, 100, 'blue', game.ctx);
        game.map = map;
        game.addAgar(player);
    });

    //-------------------------------------------------------------------------------
    test('testing the set up', () => {
        // map
        expect(map.xCoord).toBe(1000);
        expect(map.yCoord).toBe(1000);
        expect(map.width).toBe(5000);
        expect(map.height).toBe(5000);
        expect(map.game.map.game.map.game).toBe(game);
    });

    //-------------------------------------------------------------------------------
    describe('testing moveMap', () => {
        // it should be noted the the map should rarely move
        test('with positive values', () => {
            map.moveMap(100, 110);
            expect(map.xCoord).toBe(1100);
            expect(map.yCoord).toBe(1110);

            expect(map.bounds.top())
        })

        test('with negative values', () => {
            map.moveMap(-100, -110);
            map.moveMap(-500, -1000)
            expect(map.xCoord).toBe(400);
            expect(map.yCoord).toBe(-110);
        })
    });

    //-------------------------------------------------------------------------------
    describe('testing setCanvasCoords', () => {
        describe('with a scale of 1', () => {
            test('with playerAgar at 1000, 1000', () => {
                map.setCanvasCoords(1);
                expect(map.canvasCoords.x).toBe(1000);
                expect(map.canvasCoords.y).toBe(1000);
            });

            test('with playerAgar at 1500, 1500', () => {
                player.moveAgar(500, 500);
                map.setCanvasCoords(1);
                expect(map.canvasCoords.x).toBe(500);
                expect(map.canvasCoords.y).toBe(500);
            });

            test('with playerAgar at 500, 500', () => {
                player.moveAgar(-500, -500);
                map.setCanvasCoords(1);
                expect(map.canvasCoords.x).toBe(1500);
                expect(map.canvasCoords.y).toBe(1500);
            });
        });

        describe('with a scale of .5', () => {
            test('with playerAgar at 1000, 1000', () => {
                map.setCanvasCoords(.5);
                expect(map.canvasCoords.x).toBe(1000);
                expect(map.canvasCoords.y).toBe(1000);
            });

            test('with playerAgar at 1500, 1500', () => {
                player.moveAgar(500, 500);
                map.setCanvasCoords(.5);
                expect(map.canvasCoords.x).toBe(750);
                expect(map.canvasCoords.y).toBe(750);
            });

            test('with playerAgar at 500, 500', () => {
                player.moveAgar(-500, -500);
                map.setCanvasCoords(.5);
                expect(map.canvasCoords.x).toBe(1250);
                expect(map.canvasCoords.y).toBe(1250);
            });
        });

        describe('with a scale of 2', () => {
            test('with playerAgar at 1000, 1000', () => {
                map.setCanvasCoords(2);
                expect(map.canvasCoords.x).toBe(1000);
                expect(map.canvasCoords.y).toBe(1000);
            });

            test('with playerAgar at 1500, 1500', () => {
                player.moveAgar(500, 500);
                map.setCanvasCoords(2);
                expect(map.canvasCoords.x).toBe(0);
                expect(map.canvasCoords.y).toBe(0);
            });

            test('with playerAgar at 500, 500', () => {
                player.moveAgar(-500, -500);
                map.setCanvasCoords(2);
                expect(map.canvasCoords.x).toBe(2000);
                expect(map.canvasCoords.y).toBe(2000);
            });
        });
    });

    //-------------------------------------------------------------------------------
    describe('testing setCorners')
 });