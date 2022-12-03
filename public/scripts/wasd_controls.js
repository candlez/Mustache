// this script is no longer in use
// refer to the MovementKeyLogger class

var keysDown = {up: false, right: false, down: false, left: false};

/**
 * ahhhhh
 * 
 * @param {*} state 
 */
function wListener(state) {
    if (state) {
        keysDown.up = true;
        // console.log(keysDown);
        document.addEventListener("keyup", function(event) {
            if (event.key == "w") {
                this.removeEventListener("keyup", arguments.callee);
                wListener(false);
            }
        });
    } else {
        keysDown.up = false;
        // console.log(keysDown);
        document.addEventListener("keydown", function(event) {
            if (event.key == "w") {
                this.removeEventListener("keydown", arguments.callee);
                wListener(true);
            }
        });
    }
}
function aListener(state) {
    if (state) {
        keysDown.left = true;
        // console.log(keysDown);
        document.addEventListener("keyup", function(event) {
            if (event.key == "a") {
                this.removeEventListener("keyup", arguments.callee);
                aListener(false);
            }
        });
    } else {
        keysDown.left = false;
        // console.log(keysDown);
        document.addEventListener("keydown", function(event) {
            if (event.key == "a") {
                this.removeEventListener("keydown", arguments.callee);
                aListener(true);
            }
        });
    }
}
function dListener(state) {
    if (state) {
        keysDown.right = true;
        // console.log(keysDown);
        document.addEventListener("keyup", function(event) {
            if (event.key == "d") {
                this.removeEventListener("keyup", arguments.callee);
                dListener(false);
            }
        });
    } else {
        keysDown.right = false;
        // console.log(keysDown);
        document.addEventListener("keydown", function(event) {
            if (event.key == "d") {
                this.removeEventListener("keydown", arguments.callee);
                dListener(true);
            }
        });
    }
}
function sListener(state) {
    if (state) {
        keysDown.down = true;
        // console.log(keysDown);
        document.addEventListener("keyup", function(event) {
            if (event.key == "s") {
                this.removeEventListener("keyup", arguments.callee);
                sListener(false);
            }
        });
    } else {
        keysDown.down = false;
        // console.log(keysDown);
        document.addEventListener("keydown", function(event) {
            if (event.key == "s") {
                this.removeEventListener("keydown", arguments.callee);
                sListener(true);
            }
        });
    }
}
function startWASD() {
    wListener(false);
    aListener(false);
    sListener(false);
    dListener(false);
}