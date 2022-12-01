/**
 * @jest-environment jsdom
 */
import AnimatedGame from "../common/AnimatedGame";

describe('unit testing for the AnimatedGame class', () => {
    var game;

    beforeEach(() => {
        game = new AnimatedGame(2000, 2000);
    });

    //-------------------------------------------------------------------------------
    test('tests the set up and constructor', () => {
        
    });
});