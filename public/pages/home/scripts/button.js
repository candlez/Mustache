import {start} from './start.js'

const startButton = document.getElementById('startGameButton');

startButton.addEventListener('click', () => {
    start("/razor_royale")
});

const agarioButton = document.getElementById('agarioButton');

agarioButton.addEventListener('click', () => {
    start("/agario")
});