/**
 * @jest-environment jsdom
 */

const Game = require("C:///Users/tmcna/OneDrive/Documents/GitHub/MustachBranch/Mustache/Modules/Game.mjs")

let spy;
beforeAll(() => {
    spy = jest.spyOn(document, 'getElementById');
});

describe(Game, () => {
    let mockElement;

    beforeEach(() => {
        mockElement = document.createElement("canvas");
        spy.mockReturnValue(mockElement);
    })

    test('adds 1 + 2 to equal 3', () => {
        const testGame = new Game(mockElement, 100, 100);
        expect(testGame.sum(2, 3)).toBe(5)
    });

    test()
})