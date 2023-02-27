

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
    size() {
        return this.#animations.length;
    }

    addAnimation(newAnimation, index) {
        if (index === undefined) {
            this.#animations.push(newAnimation);
        } else {
            this.#animations.splice(index, 0, newAnimation);
        }

    }

    removeAnimation(animationToRemove) {
        var found = false;
        for (var i = 0; i < this.getAnimations().length; i++) {
            if (found) {
                this.getAnimations()[i - 1] = this.getAnimations[i];
            }
            if (this.getAnimations()[i] === animationToRemove) {
                this.getAnimations()[i] = null;
                found = true;
            }
        }
        this.getAnimations().pop();
    }

    animateFrame(ctx, scale) {
        this.getAnimations().forEach((animation) => {
            animation.drawFrame(ctx, scale);
        })
    }
}