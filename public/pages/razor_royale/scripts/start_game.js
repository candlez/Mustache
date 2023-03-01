import RazorRoyaleGame from '../../../razor_royale_game/RazorRoyaleGame.js'
import RazorRoyaleServerConnection from '../../../common/RazorRoyaleServerConnection.js';
import Display from '../../../common/Display.js';
import OrderedAnimationManager from '../../../common/OrderedAnimationManager.js';
import GrowingCircleAnimation from '../../../common/GrowingCircleAnimation.js';
import InteractiveDisplay from '../../../common/InteractiveDisplay.js';
import Square from './../../../common/Square.js'
import MovementKeyInterpreter from './../../../common/MovementKeyInterpreter.js'

// RazorRoyaleGame.playGame(2000, 2000); // needs to create a RazorRoyaleServerConnection instead

// const socket = io.connect(window.location.hostname);
// socket.emit("verifyServerConnection");
// socket.once("serverConnectionVerified", (data) => {
//     const connection = new RazorRoyaleServerConnection(socket);
// });

const display = InteractiveDisplay.createFullScreen();
const container = new OrderedAnimationManager();

const square = new Square(0, 0, 30);
const interpreter = new MovementKeyInterpreter(square, "w", "a", "s", "d");
interpreter.activate();

container.addAnimation(square.getAnimation());

display.addAnimationManager(container);
display.addKeyInterpreter(interpreter);

display.startAnimationLoop();
