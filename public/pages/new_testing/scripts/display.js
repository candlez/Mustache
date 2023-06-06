import GameDisplay from "../../../a/view/GameDisplay.js";
import Game from "./../../../a/model/Game.js"
import Square from "../../../a/model/Square.js";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const size = 25000;
const game = new Game(size);

for (var i = 0; i < 10000; i++) {
    const squareSize = getRandomInt(200);
    var square = new Square(i.toString(), getRandomInt(size - squareSize), getRandomInt(size - squareSize), squareSize, 
        "blue"/*rgb(getRandomInt(255), getRandomInt(255), getRandomInt(255))*/);
    game.insertStatic(square);
}

const player = new Square("player", 12500, 12500, 200, "green")
game.setPlayer(player);

console.log("done")
// console.log(game)

const display = new GameDisplay(game);
display.startAnimationLoop();

setInterval(() => {
    player.setXCoord(getRandomInt(size - 200));
    player.setYCoord(getRandomInt(size - 200));
}, 5000);

