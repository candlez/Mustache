

export default class AnimationManager {
    // fields
    #animations

    constructor() {
        this.#animations = [];
    }

    // getters and setters
    getAnimations() {
        return this.#animations;
    }

    // methods
    addAnimation(newAnimation) {
        this.#animations.push(newAnimation);
    }

    animateFrame(ctx, scale) {
        this.getAnimations().forEach((animation) => {
            animation.drawFrame(ctx, scale);
        })
    }
}