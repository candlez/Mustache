import RazorRoyaleGame from '../../../razor_royale_game/RazorRoyaleGame.js'
import RazorRoyaleServerConnection from '../../../common/RazorRoyaleServerConnection.js';
import Display from '../../../common/Display.js';
import OrderedAnimationManager from '../../../common/OrderedAnimationManager.js';
import GrowingCircleAnimation from '../../../common/GrowingCircleAnimation.js';

// RazorRoyaleGame.playGame(2000, 2000); // needs to create a RazorRoyaleServerConnection instead

// const socket = io.connect(window.location.hostname);
// socket.emit("verifyServerConnection");
// socket.once("serverConnectionVerified", (data) => {
//     const connection = new RazorRoyaleServerConnection(socket);
// });

const display = Display.createFullScreen();
var manager = new OrderedAnimationManager();
manager.addAnimation(new GrowingCircleAnimation());
display.addAnimationManager(manager)
display.startAnimationLoop();