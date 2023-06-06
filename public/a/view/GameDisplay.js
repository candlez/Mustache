import Display from "./Display.js";
import MidPointBounds from "./../model/MidPointBounds.js";

export default class GameDisplay extends Display {
    // fields
    #game


    constructor(game) {
        super("playspace", window.innerWidth, window.innerHeight);
        this.#game = game;
    }



    adjustScale() { // see if there are any innefficiencies in this
        const rate = .05;
        const originalSize = 200;
        const size = this.#game.getPlayer().getSize();
        if (size * this.getScale() > originalSize) {
            var targetScale = Math.round((originalSize / size) * 1000) / 1000;
            var diff = this.getScale() - targetScale;
            this.setScale(Math.round((this.getScale() - (diff * rate)) * 1000) / 1000);
        } else if (size * this.getScale() < originalSize) {
            var targetScale = Math.round((originalSize / size) * 1000) / 1000;
            var diff = targetScale - this.getScale();
            this.setScale(Math.round((this.getScale() + (diff * rate)) * 1000) / 1000);
        }
    }



    getDisplayBounds() { // I suppose we need to figure out how scale is going to work
        var player = this.#game.getPlayer();
        var bounds = player.getBounds();

        return new MidPointBounds(player.getXCoord() + (bounds.getWidth() / 2), player.getYCoord() + (bounds.getHeight() / 2),
            this.getWidth() / this.getScale(), this.getHeight() / this.getScale());
    }



    gatherAnimations(bounds) {
        this.clearAnimations();
        this.setAnimations(this.#game.gatherAnimations(bounds))
    }



    drawFrame() {
        this.clear();
        this.adjustScale();
        this.gatherAnimations(this.getDisplayBounds());
        var player = this.#game.getPlayer();
        var animations = this.getAnimations();
        console.log(animations.length)
        for (var i = 0; i < animations.length; i++) {
            animations[i].drawFrame(this.getCTX(), this.getScale(), player, this);
        }
    }
}