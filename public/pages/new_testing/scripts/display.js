import GameDisplay from "../../../a/view/GameDisplay.js";
import Game from "./../../../a/model/Game.js"
import Square from "../../../a/model/Square.js";
import DemoController from "../../../a/controller/DemoController.js";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const size = 25000;
const game = new Game(size);

for (var i = 0; i < 2000; i++) {
    const squareSize = getRandomInt(500);
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

// setInterval(() => {
//     var playerSize = 500 + getRandomInt(1500);
//     player.setXCoord(getRandomInt(size - playerSize));
//     player.setYCoord(getRandomInt(size - playerSize));
//     player.setSize(playerSize);

//     // console.log(player.getXCoord(), player.getYCoord(), player.getSize(), display.getDisplayBounds());
// }, 5000);

const controller = new DemoController(game, display);
controller.activateKeyLogger("up");
controller.activateKeyLogger("down");
controller.activateKeyLogger("left");
controller.activateKeyLogger("right");
controller.activateKeyLogger("sizeUp");
controller.activateKeyLogger("sizeDown");
display.setController(controller);