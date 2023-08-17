import Display from "./Display.js";
import MidPointBounds from "./../model/MidPointBounds.js";

export default class GameDisplay extends Display {
    // fields
    #game;
    #controller;
    #connection;


    constructor(game, connection) {
        super("playspace", window.innerWidth, window.innerHeight);
        this.#game = game;
        this.#controller = null;
        this.#connection = connection;

        this.setBackgroundColor("black");
    }



    adjustScale() {
        const rate = .05;
        const originalSize = 200;
        const currentSize = this.#game.getPlayer().getSize();
        if (currentSize * this.getScale() > originalSize) {
            var targetScale = Math.round((originalSize / currentSize) * 1000) / 1000;
            var diff = this.getScale() - targetScale;
            this.setScale(Math.round((this.getScale() - (diff * rate)) * 1000) / 1000);
        } else if (currentSize * this.getScale() < originalSize) {
            var targetScale = Math.round((originalSize / currentSize) * 1000) / 1000;
            var diff = targetScale - this.getScale();
            this.setScale(Math.round((this.getScale() + (diff * rate)) * 1000) / 1000);
        }
    }



    getDisplayBounds() {
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
        if (this.#controller != null && this.isCalibrated()) {
            this.#controller.interpretKeys();
        }
        if (this.#connection != null) {
            this.#connection.requestChanges();
        }
        this.adjustScale();
        this.gatherAnimations(this.getDisplayBounds());
        var animations = this.getAnimations();
        for (var i = 0; i < animations.length; i++) {
            animations[i].drawFrame(this.getCTX(), this.getScale(), this.#game.getPlayer(), this);
        }
    }


    // getters and setters


    setGame(newGame) {
        this.#game = newGame;
    }
    setController(newController) {
        this.#controller = newController;
    }
}