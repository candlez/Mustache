import GameObjectAnimation from "./GameObjectAnimation.js";



export default class SquareAnimation extends GameObjectAnimation {
    // fields



    constructor(square) {
        super(square);
    }



    drawFrame(ctx, scale, player, display) {
        const square = this.getObject();
        const canvasCoords = this.calculateCanvasCoords(square, display, player, scale);
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