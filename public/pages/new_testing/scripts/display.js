import GameDisplay from "../../../a/view/GameDisplay.js";
import Game from "./../../../a/model/Game.js"
import Square from "../../../a/model/Square.js";
import DemoController from "../../../a/controller/DemoController.js";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const colors = ["blue", "crimson", "slateblue", "seagreen", "skyblue", "orchid", "hotpink", "khaki"]

const size = 25000;
const game = new Game(size);

for (var i = 0; i < 40000; i++) {
    const squareSize = getRandomInt(250);
    var square = new Square(i.toString(), getRandomInt(size - squareSize), getRandomInt(size - squareSize), squareSize, 
        colors[getRandomInt(colors.length)]);
    game.insertStatic(square);
}

const player = new Square("player", 12500, 12500, 200, "white")
game.setPlayer(player);

console.log("done")
// console.log(game)

const display = new GameDisplay(game);
display.startAnimationLoop();


const controller = new DemoController(game, display);
controller.activateKeyLogger("up");
controller.activateKeyLogger("down");
controller.activateKeyLogger("left");
controller.activateKeyLogger("right");
controller.activateKeyLogger("sizeUp");
controller.activateKeyLogger("sizeDown");
display.setController(controller);