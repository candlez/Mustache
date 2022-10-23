/**
 * @jest-environment jsdom
 */
import Game from '../Game.js';
import GameMap from '../GameMap.js';
import Agar from '../Agar.js';


 describe('unit testing for the Agar class', () => {
    var player;
    var game;

    beforeEach(() => {
        game = new Game(2000, 2000);
        player = new Agar("player", game, true, 0, 0, 100, "blue");
        game.addAgar(player);
    });
    
    test('test set up', () => {
        expect(player.id).toBe('player');
        expect(player.game).toBe(game);
        expect(player.isPlayerAgar).toBe(true);
        expect(player.xCoord).toBe(0);
        expect(player.yCoord).toBe(0);
        expect(player.mass).toBe(100);
        expect(player.color).toBe('blue');
        expect(player.ctx).toBe(game.ctx);
    });

    //-------------------------------------------------------------------------------
    describe('tesing moveAgar', () => {
        test('on positive values', () => {
            player.moveAgar(100, 100);
            expect(player.xCoord).toBe(100);
            expect(player.yCoord).toBe(100);
        });

        test('on negative values', () => {
            player.moveAgar(-100, -100);
            expect(player.xCoord).toBe(-100);
            expect(player.yCoord).toBe(-100);
        });
    });

    //-------------------------------------------------------------------------------
    describe('testing setCanvasCoords', () => {
        var enemy;
        beforeEach(() => {
            enemy = new Agar("enemy", game, false, 1000, 1000, 50, "red");
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
                expect(enemy.canvasCoords.x).toBe(2000);
                expect(enemy.canvasCoords.y).toBe(2000);
            });

            test('with scale .5', () => {
                enemy.setCanvasCoords(.5);
                expect(enemy.canvasCoords.x).toBe(1500);
                expect(enemy.canvasCoords.y).toBe(1500);
            });

            test('with scale 2', () => {
                enemy.setCanvasCoords(2);
                expect(enemy.canvasCoords.x).toBe(3000);
                expect(enemy.canvasCoords.y).toBe(3000);
            });
        });
    });
 });