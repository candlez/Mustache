import Display from "./Display.js";
import MidPointBounds from "./../model/MidPointBounds.js";

export default class GameDisplay extends Display {
    // fields
    #game;
    #controller;


    constructor(game) {
        super("playspace", window.innerWidth, window.innerHeight);
        this.#game = game;
        this.#controller = null;
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

        return new MidPointBounds(
            Math.ceil(bounds.getCenterX()), 
            Math.ceil(bounds.getCenterY()),
            Math.ceil(this.getWidth() / this.getScale()), 
            Math.ceil(this.getHeight() / this.getScale())
        );
    }



    gatherAnimations(bounds) {
        this.clearAnimations();
        this.setAnimations(this.#game.gatherAnimations(bounds))
    }



    drawFrame() {
        this.clear();
        if (this.#controller != null) {
            this.#controller.interpretKeys();
        }
        this.adjustScale();
        var bounds = this.getDisplayBounds(); // remove later
        this.gatherAnimations(bounds);
        var player = this.#game.getPlayer();

        var rect = {
            x: (this.getWidth() * .5) + ((bounds.getLeft() - player.getBounds().getCenterX()) * this.getScale()),
            y: (this.getHeight() * .5) + ((bounds.getTop() - player.getBounds().getCenterY()) * this.getScale()),
            width: bounds.getWidth() * this.getScale(),
            height: bounds.getHeight() * this.getScale()
        }
        var ctx = this.getCTX();
        ctx.beginPath();
        ctx.rect(
            rect.x, 
            rect.y, 
            rect.width, 
            rect.height
        );
        ctx.fillStyle = "black";
        ctx.fill();

        var animations = this.getAnimations();
        for (var i = 0; i < animations.length; i++) {
            animations[i].drawFrame(this.getCTX(), this.getScale(), player, this);
        }
    }


    // getters and setters
    

    setController(newController) {
        this.#controller = newController;
    }
}