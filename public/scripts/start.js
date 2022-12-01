import AgarioGame from '../agario/AgarioGame.js';
// import RazorRoyaleGame from './RazorRoyaleGame.js';

function startGame() {
	AgarioGame.playGame();
}

function animationLoop() {
	agarGame.animateFrame();
}

export {startGame, animationLoop};