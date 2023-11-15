import GameObjectAnimation from "./GameObjectAnimation.js";



export default class SquareAnimation extends GameObjectAnimation {
    // fields



    constructor(square) {
        super(square);
    }



    drawFrame(ctx, scale, display) {
        const square = this.getObject();
        const canvasCoords = display.getCanvasCoords(square);
        ctx.beginPath();
        ctx.rect(
            canvasCoords.x,
            canvasCoords.y,
            square.getSize() * scale,
            square.getSize() * scale
        )
        ctx.fillStyle = square.getColor();
        ctx.fill();
    }
}