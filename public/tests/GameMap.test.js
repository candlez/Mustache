/**
 * @jest-environment jsdom
 */
import Game from '../Game.js';
import GameMap from '../GameMap.js';
import Agar from '../Agar.js';

 describe('unit testing for the GameMap class', () => {
    var map;
    var game;
    var player;

    beforeEach(() => {
        game = new Game(2000, 2000);
        map = new GameMap(game, 2500, 2500, 5000, 5000);
        player = new Agar('player', game, true, 2500, 2500, 100, 'blue');
        game.map = map;
        game.addAgar(player);
    });

    //-------------------------------------------------------------------------------
    test('testing the set up', () => {
        // map
        expect(map.xCoord).toBe(2500);
        expect(map.yCoord).toBe(2500);
        expect(map.width).toBe(5000);
        expect(map.height).toBe(5000);
        expect(map.game).toBe(game);
    });

    //-------------------------------------------------------------------------------
    describe('testing moveMap', () => {
        // it should be noted the the map should rarely move
        test('with positive values', () => {
            map.moveMap(100, 110);
            expect(map.xCoord).toBe(2600);
            expect(map.yCoord).toBe(2610);

            expect(map.bounds.top).toBe(110);
            expect(map.bounds.bottom).toBe(5110);
            expect(map.bounds.left).toBe(100);
            expect(map.bounds.right).toBe(5100);
        })

        test('with negative values', () => {
            map.moveMap(-100, -110);
            map.moveMap(-500, -1000)
            expect(map.xCoord).toBe(1900);
            expect(map.yCoord).toBe(1390);

            expect(map.bounds.top).toBe(-1110);
            expect(map.bounds.bottom).toBe(3890);
            expect(map.bounds.left).toBe(-600);
            expect(map.bounds.right).toBe(4400);
        })
    });

    //-------------------------------------------------------------------------------
    describe('testing setCanvasCoords', () => {
        describe('with a scale of 1', () => {
            test('with playerAgar at 2500, 2500', () => {
                map.setCanvasCoords(1);
                expect(map.canvasCoords.x).toBe(1000);
                expect(map.canvasCoords.y).toBe(1000);
            });

            test('with playerAgar at 3000, 3000', () => {
                player.moveAgar(500, 500);
                map.setCanvasCoords(1);
                expect(map.canvasCoords.x).toBe(500);
                expect(map.canvasCoords.y).toBe(500);
            });

            test('with playerAgar at 2000, 2000', () => {
                player.moveAgar(-500, -500);
                map.setCanvasCoords(1);
                expect(map.canvasCoords.x).toBe(1500);
                expect(map.canvasCoords.y).toBe(1500);
            });
        });

        describe('with a scale of .5', () => {
            test('with playerAgar at 2500, 2500', () => {
                map.setCanvasCoords(.5);
                expect(map.canvasCoords.x).toBe(1000);
                expect(map.canvasCoords.y).toBe(1000);
            });

            test('with playerAgar at 3000, 3000', () => {
                player.moveAgar(500, 500);
                map.setCanvasCoords(.5);
                expect(map.canvasCoords.x).toBe(750);
                expect(map.canvasCoords.y).toBe(750);
            });

            test('with playerAgar at 2000, 2000', () => {
                player.moveAgar(-500, -500);
                map.setCanvasCoords(.5);
                expect(map.canvasCoords.x).toBe(1250);
                expect(map.canvasCoords.y).toBe(1250);
            });
        });

        describe('with a scale of 2', () => {
            test('with playerAgar at 2500, 2500', () => {
                map.setCanvasCoords(2);
                expect(map.canvasCoords.x).toBe(1000);
                expect(map.canvasCoords.y).toBe(1000);
            });

            test('with playerAgar at 3000, 3000', () => {
                player.moveAgar(500, 500);
                map.setCanvasCoords(2);
                expect(map.canvasCoords.x).toBe(0);
                expect(map.canvasCoords.y).toBe(0);
            });

            test('with playerAgar at 2000, 2000', () => {
                player.moveAgar(-500, -500);
                map.setCanvasCoords(2);
                expect(map.canvasCoords.x).toBe(2000);
                expect(map.canvasCoords.y).toBe(2000);
            });
        });
    });

    //-------------------------------------------------------------------------------
    describe('testing setBounds', () => {
        test('with default width and height', () => {
            map.setBounds();
            expect(map.bounds.top).toBe(0);
            expect(map.bounds.bottom).toBe(5000);
            expect(map.bounds.left).toBe(0);
            expect(map.bounds.right).toBe(5000);
        });

        test('with a different width and height', () => {
            map.width = 7500;
            map.height = 10000;
            map.moveMap(1250, 2500)
            map.setBounds();
            expect(map.bounds.top).toBe(0);
            expect(map.bounds.bottom).toBe(10000);
            expect(map.bounds.left).toBe(0);
            expect(map.bounds.right).toBe(7500);
        });
    });
 });