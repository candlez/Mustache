

export default class OrderedAnimationManager {
    // fields
    #animations

    constructor() {
        // maybe animations should be turned into a map because order doesn't matter? or does it
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

    removeAnimation() {
        // finish
    }

    animateFrame(ctx, scale) {
        this.getAnimations().forEach((animation) => {
            animation.drawFrame(ctx, scale);
        })
    }
}