import AttachedAnimation from "../AttachedAnimation.js";

export default class GameObjectAnimation extends AttachedAnimation {
    // fields


    constructor(object) {
        super(object);
    }


    drawFrame(ctx, scale, player, display) {
        new Error("this method is abstract")
    }


    calculateCanvasCoords(object, display, player, scale) {
        const center = display.getCenter();
        return {
            x: center.x + (scale * (object.getXCoord() - player.getXCoord() - (.5 * player.getSize()))),
            y: center.y + (scale * (object.getYCoord() - player.getYCoord()  - (.5 * player.getSize())))
        }
    }
}