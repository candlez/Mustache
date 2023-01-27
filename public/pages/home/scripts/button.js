import {start} from './start.js'

const startButton = document.getElementById('startGameButton');

startButton.addEventListener('click', () => {
    start("http://localhost:5000/razor_royale")
});

const agarioButton = document.getElementById('agarioButton');

agarioButton.addEventListener('click', () => {
    start("http://localhost:5000/agario")
});