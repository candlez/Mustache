import {startGame, startAgario} from './start.js'

const startButton = document.getElementById('startGameButton');

startButton.addEventListener('click', startGame);

const agarioButton = document.getElementById('agarioButton');

agarioButton.addEventListener('click', startAgario);