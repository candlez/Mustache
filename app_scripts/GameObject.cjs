const Changed = require('./Changed.cjs');

class GameObject {
    // private fields
    // none

    constructor(id, type, dynamic, x, y, args) {
        this.id = id;
        this.type = type;
        this.dynamic = dynamic;
        this.x = x;
        this.y = y;
        this.args = args;
    }


    getArguments() {
        return {
            type: this.type,
            id: this.id,
            x: this.x,
            y: this.y,
            args: this.args,

            dynamic: this.dynamic
        }
    }
}

module.exports = GameObject;