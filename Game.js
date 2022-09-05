class Game {
    constructor(canvas) {
        this.gameState = true;
        this.maps = [];
        this.agars = [];
        this.renderedAgars = [];
        this.canvas = canvas;
        this.psctx = this.canvas.getContext("2d");
        this.canvas.width = 2000;
        this.canvas.height = 2000;
    }

    /*
    adds a new agar to the data
    */
    addAgar(agarName, x, y, mass, color, game, canvas){
        new Agar(agarName, x, y, mass, color, game, canvas);
        // console.log(game);
    }

    /*
    creates a map object
    and a map canvas?

    is this necessary??
    */
    addMap(mapName, x, y, width, height, scale) {
        this.maps.push(new Map(mapName, x, y, width, height, scale, document.getElementById("map")));
    }

    /*
    changes cordinates of agars based on which
    keys are being pressed
    */
    updateCords() { //needs to be made general and possibly moved
        if (keysDown.up) {
            // console.log(this.agars[0].y);
            this.agars[0].y = this.agars[0].y - 10;
        }
        if (keysDown.right) { 
            this.agars[0].x = this.agars[0].x + 10;
        }
        if (keysDown.down) {
            this.agars[0].y = this.agars[0].y + 10;
        }
        if (keysDown.left) {
            this.agars[0].x = this.agars[0].x - 10;
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
	
        agarGame.updateCords();

        agarGame.maps[0].drawMap();
    
        for (var i in agarGame.agars) {
            agarGame.agars[i].drawAgar();
        }
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
            this,
            this.psctx
        );
        // console.log(this.agars)

        /*
        player = new Agar(playSpace.width / 2, playSpace.height / 2, 40, "blue");
        this.agars.push(player);
        */

        // makes enemy agar
        /*
        random = new Agar((playSpace.width / 2) + 400, playSpace.height / 2, 40, "red");
        this.agars.push(random);
        */

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