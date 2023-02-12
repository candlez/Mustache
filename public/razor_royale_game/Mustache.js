import Agent from "../common/Agent.js";
import GameObject from "../common/GameObject.js";

export default class Mustache extends Agent {

    static PROPERTYLESS = {
        opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
        animation: {
            type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE
        }
    }

    static SPAWN_PROPERTIES = {
        opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
        animation: {
            type: GameObject.PROPERTIES.ANIMATION.TYPE.RECTANGLE,
            width: 200,
            height: 200,
        }
    }

    constructor(id, game, isPlayer, xCoord, yCoord, properties) {
        super(id, game, isPlayer, xCoord, yCoord, properties);
    }

    static createPropertyless(id, game, isPlayer, xCoord, yCoord) {
        return new Mustache(id, game, isPlayer, xCoord, yCoord, Mustache.PROPERTYLESS);
    }
}