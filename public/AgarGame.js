import Game from './Game.js';

var agarGame;

function startGame() {
	agarGame = new Game(2000, 2000);
	agarGame.playGame();
}

function animationLoop() {
	agarGame.animateFrame();
}

export {startGame, animationLoop};