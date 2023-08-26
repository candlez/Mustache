import GameDisplay from "../../../a/view/GameDisplay.js";
import Game from "./../../../a/model/Game.js"
import Square from "../../../a/model/Square.js";
import DemoController from "../../../a/controller/DemoController.js";
import GridAnimation from "../../../a/view/animations/game_objects/GridAnimation.js";
import ServerConnection from "../../../a/server/ServerConnection.js";


console.log("starting")
var name = "Thomas";
var color = "crimson";

// 1. create a loading screen
// later

// 2. create the connection with the correct domain
const connection = new ServerConnection(window.location.hostname);

// 3. create the game (ask what width)
connection.initializeGame() // add a grid to the game
// 4. make initial request for data and add it to the game
.then(() => {
    return connection.addInitialDataToGame();
// 5. set up listeners to wait for changes coming from the server
}).then(() => {
    // wait for, wait for, wait for, wait for
    connection.setUpListeners();
// 6. decide where the player is going, create the object, put them there
//    and tell the server that you have done so
}).then(() => {
    return connection.spawnPlayer(name, color);
// 7. create a game display
}).then(() => {
    connection.setDisplay(new GameDisplay(connection.getGame(), connection));
// 8. create a controller(s) and add them
}).then(() => {
    const controller = new DemoController(connection.getGame(), 
        connection.getDisplay(), connection);
    controller.activateKeyLogger("up");
    controller.activateKeyLogger("down");
    controller.activateKeyLogger("left");
    controller.activateKeyLogger("right");
    controller.activateKeyLogger("sizeUp");
    controller.activateKeyLogger("sizeDown");
    controller.activateKeyLogger("stopSending");
    controller.getDisplay().setController(controller);
// 9. start animation loop
}).then(() => {
    connection.getDisplay().startAnimationLoop();
})













// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
// }

// const colors = ["blue", "crimson", "slateblue", "seagreen", "skyblue", "orchid", "hotpink", "khaki"]

// const size = 25000;
// const game = new Game(size);

// for (var i = 0; i < 4000; i++) {
//     const squareSize = getRandomInt(250);
//     var square = new Square(i.toString(), getRandomInt(size - squareSize), getRandomInt(size - squareSize), squareSize, 
//         colors[getRandomInt(colors.length)]);
//     game.insertStatic(square);
// }

// for (var i = 0; i < 250; i++) {
//     game.insertDynamic(new Square(i.toString(), 12000, 100 * i, 100, colors[getRandomInt(colors.length)]));
// }

// const player = new Square("player", 12500, 12500, 200, "crimson")
// game.setPlayer(player);

// const grid = new GridAnimation(25000, 25000, 200, "silver");
// game.addBackgroundAnimation(grid);

// const display = new GameDisplay(game);
// display.startAnimationLoop();


// const controller = new DemoController(game, display);
// controller.activateKeyLogger("up");
// controller.activateKeyLogger("down");
// controller.activateKeyLogger("left");
// controller.activateKeyLogger("right");
// controller.activateKeyLogger("sizeUp");
// controller.activateKeyLogger("sizeDown");
// display.setController(controller);


// setInterval(() => {
//     for (var i = 0; i < 250; i++) {
//         const obj = game.getDynamicMap().get(i.toString());
//         game.moveDynamic(obj.getID(), obj.getXCoord() + 1, obj.getYCoord());
//     }
// }, 13.3)

// function standardize_color(str){
//     var ctx = document.createElement('canvas').getContext('2d');
//     ctx.fillStyle = str;
//     return ctx.fillStyle;
// }

// console.log(standardize_color("red"))
