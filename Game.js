class Game {
    constructor(canvas, width, height) {
        // setting up attributes
        this.gameState = true;
        this.maps = [];
        this.agars = [];
        this.renderedAgars = [];

        // setting up canvas
        this.canvas = canvas;
        console.log(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
    }


    /*
    creates a canvas element to draw on
    */
    createCanvas(element) {
 
    }

    clearPlaySpace() {
        this.ctx.clearRect(0, 0, agarGame.canvas.width, agarGame.canvas.height);
    }
    /*
    adds a new agar to the data
    */
    addAgar(agarName, x, y, mass, color, canvas, isPlayer){
        this.agars.push(new Agar(
            agarName,
            x,
            y,
            mass,
            color,
            canvas,
            isPlayer
        ));
        // console.log(game);
    }

    /*
    creates a map object
    and a map canvas?

    is this necessary??
    */
    addMap(mapName, x, y, width, height, scale) {
        var newMap = document.createElement("canvas");
        newMap.id = "map";
        newMap.style.zIndex = -1;
        document.body.append(newMap)
        this.maps.push(new Map(
            mapName,
            x,
            y,
            width,
            height,
            scale,
            "white",
            newMap
        ));
    }

    /*
    changes cordinates of agars based on which
    keys are being pressed
    */
    updateCords() {
        if (keysDown.up) {
            for (var i in this.agars) {
                if (!this.agars[i].isPlayer) {
                    this.agars[i].y = this.agars[i].y + 5
                }
            }
            this.maps[0].y = this.maps[0].y + 5;
        }
        if (keysDown.right) { 
            for (var i in this.agars) {
                if (!this.agars[i].isPlayer) {
                    this.agars[i].x = this.agars[i].x - 5
                }
            }
            this.maps[0].x = this.maps[0].x - 5;
        }
        if (keysDown.down) {
            for (var i in this.agars) {
                if (!this.agars[i].isPlayer) {
                    this.agars[i].y = this.agars[i].y - 5
                }
            }
            this.maps[0].y = this.maps[0].y - 5;
        }
        if (keysDown.left) {
            for (var i in this.agars) {
                if (!this.agars[i].isPlayer) {
                    this.agars[i].x = this.agars[i].x + 5
                }
            }
            this.maps[0].x = this.maps[0].x + 5;
        }
    }

    /*
    animates one frame by erasing old frame
    and drawing new one

    the general idea of movement is to update position
    data for agars relative to the map and position data
    for the map relative to the canvas. Then, the map
    should be drawn with it's coordinates relative to
    the canvas, and the agars can be drawn with their
    coordinates relative to the map

    the player's agar should remain in the center of the
    screen, the map is being repositioned in the opposite
    way that the player's agar is.
    */
    animateFrame() {
        // erases old canvas
        agarGame.maps[0].eraseMap();
        agarGame.clearPlaySpace();

        // updates all of the coordinates
        agarGame.updateCords();

        // draws the map
        agarGame.maps[0].drawMap();
        
        // draws all of the agars in the game
        for (var i in agarGame.agars) {
            agarGame.agars[i].drawAgar();
        }
        
        // starts new frame if game is still running
        if (agarGame.gameState) {
            window.requestAnimationFrame(agarGame.animateFrame);
        }
    }

    /*
    continuously keeps the game running by
    animating frames and keeping game data
    up to date
    */
    playGame() {
        this.gameState = true;

        // hides start screen elements
        document.getElementById("paragraph").style.display = "none";
        document.getElementById("pressMe").style.display = "none";

        // makes map
        this.addMap("map1", 0, 0, 2000, 2000, 1);
        //this.maps.push(new Map(0 , 0, map.width, map.height, 1));

        // makes player agar
        this.addAgar(
            "player",
            playSpace.width / 2,
            playSpace.height / 2,
            40,
            "blue",
            document.getElementById("playSpace"),
            true
        );
        
        // makes enemy agar
        this.addAgar(
            "enemy",
            (playSpace.width / 2) + 100,
            (playSpace.height / 2) - 100,
            20,
            "red",
            document.getElementById("playSpace"),
            false
        )

        // starts animation loop
        window.requestAnimationFrame(this.animateFrame);

        // starts taking keyboard inputs for movement
        startWASD();
    }

    // for testing
    drawLine() {
        this.psctx.moveTo(2000, 0);
        this.psctx.lineTo(0, 2000);
        this.psctx.stroke();
    }
}