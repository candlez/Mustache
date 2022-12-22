import AnimatedGame from '../common/AnimatedGame.js'

export default class RazorRoyaleGame extends AnimatedGame {
    /**
     * initializes a new RazorRoyaleGame object
     * 
     * @param {Number} width - the width of the canvas
     * @param {Number} height - the height of the canvas
     */
    constructor(width, height) {
        super(width, height);
    }

    /**
     * 
     */
    static playGame(width, height) {
        const game = new RazorRoyaleGame(width, height);

        
    }
}