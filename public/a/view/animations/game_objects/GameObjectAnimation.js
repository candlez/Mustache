import Animation from "./../Animation.js"

export default class GameObjectAnimation extends Animation {
    // fields
    #object;

    constructor(object) {
        super();
        this.#object = object;
    }


    drawFrame(ctx, scale, player, display) {
        new Error("this method is abstract")
    }


    // this functionality was moved to GameDisplay
    // calculateCanvasCoords(object, display, player, scale) {
    //     const center = display.getCenter();
    //     return {
    //         x: center.x + (scale * (object.getXCoord() - player.getXCoord() - (.5 * player.getSize()))),
    //         y: center.y + (scale * (object.getYCoord() - player.getYCoord()  - (.5 * player.getSize())))
    //     }
    // }

    // getters
    getObject() {
        return this.#object;
    }

    // setters
    setObject(obj) {
        this.#object = obj;
    }
}