import GameObjectAnimation from "./GameObjectAnimation.js";



export default class SquareAnimation extends GameObjectAnimation {
    // fields



    constructor(square) {
        super(square);
    }



    drawFrame(ctx, scale, player, display) {
        const square = this.getObject();

        // calculate canvas coords
        const center = display.getCenter();
        const canvasCoords = {
            x: center.x + (scale * (square.getXCoord() - player.getXCoord())),
            y: center.y + (scale * (square.getYCoord() - player.getYCoord()))
        }

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