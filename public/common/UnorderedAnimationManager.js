

export default class UnorderedAnimationManager {
    // fields
    #animations;

    constructor() {
        this.#animations = new Map();
    }

    // getters and setters
    getAnimations() {
        return this.#animations;
    }

    // methods
    addAnimation(id, animation) {
        this.#animations.set(id, animation);
    }

    removeAnimation(id) {
        this.#animations.delete(id);
    }

    animateFrame(ctx, scale) {
        for (const key of this.getAnimations()) {
            this.getAnimations().get(key).drawFrame(ctx, scale);
        }
    }
}