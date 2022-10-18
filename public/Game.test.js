/**
 * @jest-environment jsdom
 */
import Agar from './Agar.js';
import Game from './Game.js';
import GameMap from './GameMap.js';


describe('unit testing for the Game class', () => {
    var game;

    beforeEach(() => {
        game = new Game(2000, 2000);
    });
    
    //-------------------------------------------------------------------------------
    test('testing the set up', () => {
        expect(game.width).toBe(2000);
        expect(game.height).toBe(2000);
        expect(game.map).toBe(null);
    });
    
    //-------------------------------------------------------------------------------
    describe('testing setMap', () =>{
        test('testing setMap with a non-map as argument', () => {
            game.setMap(2);
            expect(game.map).toBe(null);
        });
    
        test('testing setMap with a map as the argument', () => {
            const gameMap = new GameMap(0, 0, 2000, 2000, game.ctx);
            game.setMap(gameMap);
            expect(game.map.xCoord).toBe(0);
            expect(game.map.yCoord).toBe(0);
            expect(game.map.width).toBe(2000);
            expect(game.map.height).toBe(2000);
        });
    });

    //-------------------------------------------------------------------------------
    describe('testing addAgar', () => {
        test('on a non-agar', () => {
            game.addAgar(2);
            expect(game.agars.length).toBe(0);
        })

        test('on an agar', () => {
            game.addAgar(new Agar("tester", game, 0, 0, 50, "blue", game.ctx));
            expect(game.agars.length).toBe(1);
            expect(game.agars[0].id).toBe('tester');
        })
    })

    //-------------------------------------------------------------------------------
    describe('testing removeAgar', () => {
        beforeEach(() => {
            game = new Game(2000, 2000);
            game.addAgar(new Agar("tester", game, 0, 0, 50, "blue", game.ctx))
            game.addAgar(new Agar("player", game, 0, 0, 50, "blue", game.ctx))
            game.addAgar(new Agar("player", game, 0, 0, 50, "blue", game.ctx))
            game.addAgar(new Agar("gamer", game, 0, 0, 50, "blue", game.ctx))
            game.addAgar(new Agar("tester", game, 0, 0, 50, "blue", game.ctx))
        });

        test('on an id that doesnt exist', () => {
            expect(game.agars.length).toBe(5);
            game.removeAgar('fortnite');
            expect(game.agars.length).toBe(5);
        });

        test('on an id that appears once', () => {
            expect(game.agars.length).toBe(5);
            game.removeAgar('gamer');
            expect(game.agars.length).toBe(4);
        });

        test('on an id that appears twice consecutively', () => {
            expect(game.agars.length).toBe(5);
            game.removeAgar('player');
            expect(game.agars.length).toBe(3);
        });

        test('on an id that appears twice non-conscutively', () => {
            expect(game.agars.length).toBe(5);
            game.removeAgar('tester');
            expect(game.agars.length).toBe(3);
        });
    });

    //-------------------------------------------------------------------------------
    
});