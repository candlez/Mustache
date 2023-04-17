import Bounds from "./Bounds.js";

export default class TopCornerBounds extends Bounds {
    constructor(xCoord, yCoord, width, height) {
        super(xCoord, yCoord, width, height);
    }


    setUp(xCoord, yCoord, width, height) {
        return {
            left: xCoord, 
            top: yCoord, 
            width: width, 
            height: height
        };
    }



    // getters

}