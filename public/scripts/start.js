import AgarioGame from '../agario/AgarioGame.js';
// import RazorRoyaleGame from './RazorRoyaleGame.js';

function startGame() {
	AgarioGame.playGame(2000, 2000);
}

export {startGame};