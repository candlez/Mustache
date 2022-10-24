/**
 * @jest-environment jsdom
 */
import Game from '../Game.js';
import GameMap from '../GameMap.js';
import Agar from '../Agar.js';


 describe('unit testing for the Agar class', () => {
    var player;
    var game;
    var map;

    beforeEach(() => {
        game = new Game(2000, 2000);
        player = new Agar("player", game, true, 1000, 1000, 100, "blue");
        game.addAgar(player);
        map = new GameMap(game, 1000, 1000, 2000, 2000);
        game.setMap(map);
    });
    
    test('test set up', () => {
        expect(player.id).toBe('player');
        expect(player.game).toBe(game);
        expect(player.isPlayerAgar).toBe(true);
        expect(player.xCoord).toBe(1000);
        expect(player.yCoord).toBe(1000);
        expect(player.mass).toBe(100);
        expect(player.color).toBe('blue');
        expect(player.ctx).toBe(game.ctx);
    });

    //-------------------------------------------------------------------------------
    describe('tesing moveAgar', () => {
        test('with positive values', () => {
            player.moveAgar(100, 100);
            expect(player.xCoord).toBe(1100);
            expect(player.yCoord).toBe(1100);
        });

        test('with negative values', () => {
            player.moveAgar(-100, -100);
            expect(player.xCoord).toBe(900);
            expect(player.yCoord).toBe(900);
        });

        test('while trying to move out of the upper and left bounds', () => {
            player.moveAgar(-901, -901);
            expect(player.xCoord).toBe(100);
            expect(player.yCoord).toBe(100);
        });

        test('while trying to move out of the lower and right bounds', () => {
            player.moveAgar(901, 901);
            expect(player.xCoord).toBe(1900);
            expect(player.yCoord).toBe(1900);
        });
    });

    //-------------------------------------------------------------------------------
    describe('testing setCanvasCoords', () => {
        var enemy;
        beforeEach(() => {
            enemy = new Agar("enemy", game, false, 1500, 1500, 50, "red");
        });

        describe('with playerAgar', () => {
            test('with scale 1', () => {
                player.setCanvasCoords(1);
                expect(player.canvasCoords.x).toBe(1000);
                expect(player.canvasCoords.y).toBe(1000);
            });

            test('with scale .5', () => {
                player.setCanvasCoords(.5);
                expect(player.canvasCoords.x).toBe(1000);
                expect(player.canvasCoords.y).toBe(1000);
            });

            test('with scale 2', () => {
                player.setCanvasCoords(2);
                expect(player.canvasCoords.x).toBe(1000);
                expect(player.canvasCoords.y).toBe(1000);
            });
        });
        
        describe('with an enemy Agar', () => {
            test('with scale 1', () => {
                enemy.setCanvasCoords(1);
                expect(enemy.canvasCoords.x).toBe(1500);
                expect(enemy.canvasCoords.y).toBe(1500);
            });

            test('with scale .5', () => {
                enemy.setCanvasCoords(.5);
                expect(enemy.canvasCoords.x).toBe(1250);
                expect(enemy.canvasCoords.y).toBe(1250);
            });

            test('with scale 2', () => {
                enemy.setCanvasCoords(2);
                expect(enemy.canvasCoords.x).toBe(2000);
                expect(enemy.canvasCoords.y).toBe(2000);
            });
        });
    });
 });