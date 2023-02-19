import GameObject from "../common/GameObject.js";

export default class Electricity extends GameObject {


    static ELECTRICITY_PROPERTIES = {
        opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
        animation: {
            type: GameObject.PROPERTIES.ANIMATION.TYPE.CIRCLE,
            color: "yellow",
            radius: 15
        }
    }

    constructor(id, game, xCoord, yCoord) {
        super(id, game, xCoord, yCoord, Electricity.ELECTRICITY_PROPERTIES);
    }
}