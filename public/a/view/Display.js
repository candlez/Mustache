


export default class Display {
    // fields
    #width;
    #height;
    #canvas;
    #ctx;

    #scale;
    #backgroundColor;
    #active;

    #animations;

    constructor(id, width, height) {
        this.#width = width;
        this.#height = height;

        this.#canvas = document.createElement('canvas');
        this.#canvas.id = id;
        // an important conversation needs to be had about
        // the manner in which these canvases will be styled
        this.#canvas.width = width;
        this.#canvas.height = height;
        document.body.appendChild(this.#canvas);

        this.#ctx = this.#canvas.getContext('2d');

        this.#scale = 1;
        this.#backgroundColor = "white";
        this.#active = false;

        this.#animations = [];
    }



    addAnimation(newAnimation) {
        this.#animations.push(newAnimation);
    }



    clearAnimations() {
        this.#animations = [];
    }



    isActive() {
        return this.#active;
    }



    clear() {
        const ctx = this.getCTX();
        ctx.beginPath();
        ctx.rect(0, 0, this.getWidth(), this.getHeight());
        ctx.fillStyle = this.getBackgroundColor();
        ctx.fill();    
    }



    drawFrame() {
        this.clear();
        for (var i = 0; i < this.#animations.length; i++) {
            this.#animations[i].drawFrame(this.#ctx, this.#scale);
        }
    }



    startAnimationLoop() {
        this.#active = true;
        const display = this;
        function animationLoop() {
            display.drawFrame();
            if (display.isActive()) {
                requestAnimationFrame(animationLoop);
            }
        }
        requestAnimationFrame(animationLoop);
    }



    createController() {
        new Error("this method is abstract")
    }



    getCenter() {
        return {
            x: this.getWidth() / 2,
            y: this.getHeight() / 2,
        }
    }



    // getters and setters
    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }
    getCanvas() {
        return this.#canvas;
    }
    getCTX() {
        return this.#ctx;
    }
    getScale() {
        return this.#scale;
    }
    getBackgroundColor() {
        return this.#backgroundColor;
    }
    getAnimations() {
        return this.#animations;
    }


    setWidth(newWidth) {
        this.#width = newWidth;
        this.#canvas.width = newWidth;
    }
    setHeight(newHeight) {
        this.#height = newHeight;
        this.#canvas.height = newHeight;
    }
    setScale(newScale) {
        this.#scale = newScale;
    }
    setBackgroundColor(newColor) {
        this.#backgroundColor = newColor;
    }
    setAnimations(newAnimations) {
        this.#animations = newAnimations;
    }
}