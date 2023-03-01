import AttachedAnimation from "./AttachedAnimation.js";

export default class SquareAnimation extends AttachedAnimation {
    // fields

    constructor(square) {
        super(square);
    }

    // methods
    drawFrame(ctx, scale) {
        const square = this.getObject();
        ctx.beginPath();
        ctx.rect(
            square.getXCoord() - (square.getSize() / 2), 
            square.getYCoord() - (square.getSize() / 2), 
            square.getSize(), 
            square.getSize()
        );
        ctx.fillStyle = "crimson";
        ctx.fill();
    }
}