const GameObject = require("./GameObject.cjs");

class DynamicGameObject extends GameObject {


    constructor(id, type, dynamic, x, y, vectors, args) {
        super(id, type, dynamic, x, y, args);

        this.lastVectorChange = Date.now(); // this is wrong now
        this.vectors = vectors;
    }


    getArguments() {
        return {
            type: this.type,
            id: this.id,
            x: this.x,
            y: this.y,
            lastVectorChange: this.lastVectorChange,
            vectors: this.vectors,
            args: this.args,

            dynamic: this.dynamic
        }
    }

}

module.exports = DynamicGameObject;