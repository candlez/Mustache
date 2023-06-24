import GameObjectAnimation from "./GameObjectAnimation.js";

export default class GridAnimation extends GameObjectAnimation {
    // fields
    #squareSize;
    #lineColor;

    constructor(width, height, squareSize, lineColor) {
        super({
            getXCoord() {
                return 0;
            },
            getYCoord() {
                return 0;
            },
            getWidth() {
                return width;
            },
            getHeight() {
                return height;
            }
        });
        if (squareSize % width != 0 || squareSize % height != 0) {
            new Error("grid width and height must be evenly divisible by square size!")
        }
        this.#squareSize = squareSize;
        this.#lineColor = lineColor;
    }



    drawFrame(ctx, scale, player, display) {
        const grid = this.getObject();
        const canvasCoords = this.calculateCanvasCoords(grid, display, player, scale);
        ctx.beginPath();
        ctx.rect(canvasCoords.x, canvasCoords.y, grid.getWidth() * scale, grid.getHeight() * scale);

        // split x and y
        const bounds = player.getBounds();
        var x = bounds.getCenterX() - (bounds.getCenterX() % this.#squareSize);
        var y = bounds.getCenterY() - (bounds.getCenterY() % this.#squareSize);
        var point = {
            getXCoord() {
                return x;
            },
            getYCoord() {
                return y;
            }
        };
        const canvasPoint = this.calculateCanvasCoords(point, display, player, scale);
        const gap = this.getSquareSize() * scale;
         
        var counter = 0;

        ctx.beginPath();
        ctx.strokeStyle = this.#lineColor;
        ctx.lineWidth = 1;
        while (gap * counter * 2 < display.getWidth()) {
            if (x + ((counter + 1) * this.#squareSize) <= grid.getXCoord() + grid.getWidth()) {
                ctx.moveTo(canvasPoint.x + ((counter + 1) * gap), Math.max(0, canvasCoords.y));
                ctx.lineTo(canvasPoint.x + ((counter + 1) * gap), Math.min(display.getHeight(), canvasCoords.y + (grid.getHeight() * scale)));
            }

            if (x - (counter * this.#squareSize) >= grid.getXCoord()) {
                ctx.moveTo(canvasPoint.x - (counter * gap), Math.max(0, canvasCoords.y));
                ctx.lineTo(canvasPoint.x - (counter * gap), Math.min(display.getHeight(), canvasCoords.y + (grid.getHeight() * scale)));
            }

            counter++;
        }
        counter = 0;
        while (gap * counter * 2 < display.getHeight()) {
            if (y + ((counter + 1) * this.#squareSize) <= grid.getYCoord() + grid.getHeight()) {
                ctx.moveTo(Math.max(0, canvasCoords.x), canvasPoint.y + ((counter + 1) * gap));
                ctx.lineTo(Math.min(display.getWidth(), canvasCoords.x + (grid.getWidth() * scale)), canvasPoint.y + ((counter + 1) * gap));
            }

            if (y - (counter * this.#squareSize) >= grid.getYCoord()) {
                ctx.moveTo(Math.max(0, canvasCoords.x), canvasPoint.y - (counter * gap));
                ctx.lineTo(Math.min(display.getWidth(), canvasCoords.x + (grid.getWidth() * scale)), canvasPoint.y - (counter * gap));
            }

            counter++;
        }
        ctx.stroke();
    }


    // getters and setters
    getSquareSize() {
        return this.#squareSize;
    }
}