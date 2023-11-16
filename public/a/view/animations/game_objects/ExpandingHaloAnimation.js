import GameObjectAnimation from "./GameObjectAnimation.js";

export default class ExpandingHaloAnimation extends GameObjectAnimation {
    
    constructor(square) {
        super(square);
    }


    drawFrame(ctx, scale, display) {
        if (this.getCurrentFrame() == 120) this.setCurrentFrame(0);
        const square = this.getObject();
        const canvasCoords = display.getCanvasCoords(square);
        const haloSize = Math.abs(60 - this.getCurrentFrame()) * scale * .5;
        ctx.beginPath();
        ctx.rect(
            canvasCoords.x - (haloSize / 2),
            canvasCoords.y - (haloSize / 2),
            (square.getSize() * scale) + haloSize,
            (square.getSize() * scale) + haloSize
        );
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = haloSize;
        ctx.stroke();
        this.incrementFrame();
    }
}