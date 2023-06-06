import Display from "../../../a/view/Display.js";
import GrowingCircleAnimation from "../../../a/view/animations/GrowingCircleAnimation.js"

var display = new Display("hockey", window.innerWidth, window.innerHeight);
display.addAnimation(new GrowingCircleAnimation());

display.startAnimationLoop();