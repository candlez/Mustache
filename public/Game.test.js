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
    describe('testing sortAgarsByMass', () => {
        test('on a regular list', () => {
            game.addAgar(new Agar("2", game, 0, 0, 10, "blue", game.ctx));
            game.addAgar(new Agar("3", game, 0, 0, 50, "blue", game.ctx));
            game.addAgar(new Agar("5", game, 0, 0, 150, "blue", game.ctx));
            game.addAgar(new Agar("1", game, 0, 0, 0, "blue", game.ctx));
            game.addAgar(new Agar("4", game, 0, 0, 60, "blue", game.ctx));

            game.sortAgarsByMass();
            expect(game.agars[0].id).toBe('5');
            expect(game.agars[1].id).toBe('4');
            expect(game.agars[2].id).toBe('3');
            expect(game.agars[3].id).toBe('2');
            expect(game.agars[4].id).toBe('1');
        });

        test('on a list with agars of equal mass', () => {
            game.addAgar(new Agar("2", game, 0, 0, 10, "blue", game.ctx));
            game.addAgar(new Agar("3", game, 0, 0, 10, "blue", game.ctx));
            game.addAgar(new Agar("5", game, 0, 0, 150, "blue", game.ctx));
            game.addAgar(new Agar("1", game, 0, 0, 0, "blue", game.ctx));
            game.addAgar(new Agar("4", game, 0, 0, 60, "blue", game.ctx));

            game.sortAgarsByMass();
            expect(game.agars[0].id).toBe('5');
            expect(game.agars[1].id).toBe('4');
            expect(game.agars[2].id).toBe('2');
            expect(game.agars[3].id).toBe('3');
            expect(game.agars[4].id).toBe('1');
        });
    });

    //-------------------------------------------------------------------------------
    describe('testing checkIfEaten', () => {
        beforeEach(() => {
            game.addAgar(new Agar("1", game, 0, 0, 20, "blue", game.ctx));
            game.addAgar(new Agar("2", game, 0, 0, 10, "blue", game.ctx));
        });

        test('when agars are have exact same coordinates', () => {
            expect(game.checkIfEaten(game.agars[0], game.agars[1])).toBe(true);
        });

        test('when agars are very far apart', () => {
            game.agars[1].xCoord = 100;
            expect(game.checkIfEaten(game.agars[0], game.agars[1])).toBe(false);

        });

        test('when agars are close but not close enough', () => {
            game.agars[1].xCoord = 8;
            game.agars[1].yCoord = 8;
            expect(game.checkIfEaten(game.agars[0], game.agars[1])).toBe(false);
        });

        test('when agars are just close enough', () => {
            game.agars[1].xCoord = 7;
            game.agars[1].yCoord = 7;
            expect(game.checkIfEaten(game.agars[0], game.agars[1])).toBe(true);
        });

        test('when Math.ceil(combinedRadii / 2) == xDiff + yDiff', () => {
            game.agars[1].xCoord = 8;
            game.agars[1].yCoord = 7;
            expect(game.checkIfEaten(game.agars[0], game.agars[1])).toBe(false);
        });
    });

    //-------------------------------------------------------------------------------
    describe('testing eatCheck', () => {
        beforeEach(() => {
            game.addAgar(new Agar("big", game, 0, 0, 30, "blue", game.ctx));
            game.addAgar(new Agar("big", game, 0, 0, 20, "blue", game.ctx));
            game.addAgar(new Agar("big", game, 0, 0, 10, "blue", game.ctx));
        });
    });
});