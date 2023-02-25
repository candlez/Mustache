

/**
 * represents an Animation that can be drawn frame by frame on a canvas
 */
export default class Animation {
    // fields
    #currentFrame

    constructor() {
        this.#currentFrame = 0;
    }

    // getters and setters
    setCurrentFrame(newCurrentFrame) {
        this.#currentFrame = newCurrentFrame;
    }
    getCurrentFrame() {
        return this.#currentFrame;
    }

    // methods
    drawFrame(ctx, scale) {
        throw new Error("this is an abstract method and shouldn't be called")
    }

}