import Bounds from "./Bounds.js";

export default class MidPointBounds extends Bounds {
    constructor(xCoord, yCoord, width, height) {
        super(xCoord, yCoord, width, height);
    }

    setUp(xCoord, yCoord, width, height) {
        var halfX = width / 2;
        var halfY = height / 2;

        return {
            top: yCoord - halfY,
            left: xCoord - halfX,
            width: width,
            height: height
        }
    }
}