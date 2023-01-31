import GameObject from "../common/GameObject.js";

export default class Wall extends GameObject {


    constructor(id, game, xCoord, yCoord, width, height, color) {
        super(id, game, xCoord, yCoord, {
            opacity: GameObject.PROPERTIES.OPACITY.BLOCKING,
            animation: {
                type: GameObject.PROPERTIES.ANIMATION.TYPE.RECTANGLE,
                width: width,
                height: height,
                color: color,
            }
        });
    }
}