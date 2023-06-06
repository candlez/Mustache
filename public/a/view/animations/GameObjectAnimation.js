import AttachedAnimation from "./AttachedAnimation.js";

export default class GameObjectAnimation extends AttachedAnimation {
    // fields


    constructor(object) {
        super(object);
    }


    drawFrame(ctx, scale, player, display) {
        new Error("this method is abstract")
    }
}