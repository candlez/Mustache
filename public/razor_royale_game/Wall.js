import GameObject from "../common/GameObject.js";

export default class Wall extends GameObject {

    static PROPERTYLESS = {
        opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
        animation: {
            type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE
        }
    }

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

    static createPropertyless(id, game, xCoord, yCoord) {
        var wall = new Wall(id, game, xCoord, yCoord, 0, 0, "white");
        wall.setProperties(Wall.PROPERTYLESS);
        return wall;
    }
}