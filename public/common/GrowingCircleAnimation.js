import Animation from "./Animation.js";

export default class GrowingCircleAnimation extends Animation {


    constructor() {
        super();
    }

    drawFrame(ctx, scale) {
        if (this.getCurrentFrame() == 300) {
            this.setCurrentFrame(0);
        }
        ctx.beginPath();
        ctx.arc(window.innerWidth / 2, window.innerHeight / 2, this.getCurrentFrame() * scale, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
        this.setCurrentFrame(this.getCurrentFrame() + 1);
    }
}