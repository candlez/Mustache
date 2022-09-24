module.exports = class Game {
    constructor(canvas, width, height) {
        // setting up attributes
        this.gameState = true;
        this.maps = [];
        this.agars = [];
        this.renderedAgars = [];

        // setting up canvas
        this.canvas = canvas;
        // console.log(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
    }


    /**
     * creates a canvas?
     * 
     * @param {*} element 
     */
    createCanvas(element) {
        var newCanvas = document.createElement("canvas");

    }

    /**
     * clears the playspace canvas, which should erase all of
     * the agars
     */
    clearPlaySpace() {
        this.ctx.clearRect(0, 0, agarGame.canvas.width, agarGame.canvas.height);
    }

    /**
     * sorts the Agars in order of ascending mass
     * 
     * @param {list} agarList 
     */
    sortAgars(agarList) {
        agarList.sort(function(a, b) {
            return a.mass - b.mass;
        })
    }

    /**
     * instantiates a new Agar object and adds it to
     * the list of Agars in the game
     * 
     * @param {string} agarName 
     * @param {int} x 
     * @param {int} y 
     * @param {int} mass
     * @param {string} color 
     * @param {html canvas element} canvas
     * @param {boolean} isPlayer
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
    }

    /**
     * 
     * @param {Agar object} agar 
     */
    deleteAgar(agar) {
        for (i in this.agars) {
            if (agar.name = this.agars[i].name) {
                this.agars.splice(i, 1);
            }
            console.log(this.agars);
        }
    }

    /**
     * instantiates a new map object and creates a canvas for it
     * to be drawn on 
     * 
     * @param {string} mapName 
     * @param {int} x 
     * @param {int} y 
     * @param {int} width 
     * @param {int} height 
     * @param {int} scale 
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

    /**
     * checks to see if any of the agars are touching
     * 
     * @param {list} agarList
     */
    agarTouchCheck(agarList) {
        var testAgarList = agarList;
        for (var i in testAgarList) {
            if (testAgarList != 1) {
                // calculates squared distance between current agar
                // and last agar
                var x1 = this.agars[i].x
                var x2 = this.agars[this.agars.length - 1].x
                var y1 = this.agars[i].y
                var y2 = this.agars[this.agars.length - 1].y
                var xDistance = (x1) - (x2)
                var yDistance = (y1) - (y2)
                var squaredDistance = (
                    (xDistance * xDistance) + 
                    (yDistance * yDistance)
                )

                // checks if sum of radii is larger than difference
                // if yes, eat last agar and remove it
                // if no, remove last agar from list
                var totalRadius = (
                    this.agars[i].mass + 
                    this.agars[this.agars.length - 1].mass
                )
                if ((totalRadius > squaredDistance)) {
                    this.agars[i].eatAgar(this.agars[this.agars.length - 1]);
                }
                testAgarList.pop();
            }
        }
    }

    /**
     * updates the cordinates of objects based on current info
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

    /**
     * animates one frame by erasing old frame
     * and drawing new one
     * 
     * the general idea of movement is to update position
     * data for agars relative to the map and position data
     * for the map relative to the canvas. Then, the map
     * should be drawn with it's coordinates relative to
     * the canvas, and the agars can be drawn with their
     * coordinates relative to the map
     * 
     * the player's agar should remain in the center of the
     * screen, the map is being repositioned in the opposite
     * way that the player's agar is.
     */
    animateFrame() {
        // erases old canvas
        agarGame.maps[0].eraseMap();
        agarGame.clearPlaySpace();

        // updates all of the coordinates
        agarGame.updateCords();

        // sorts agars by mass
        agarGame.sortAgars(agarGame.agars);

        // check for eat
        agarGame.agarTouchCheck();

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

    /**
     * continuously keeps the game running by animating frames 
     * and keeping game data up to date
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

    sum(a, b) {
        return a + b;
    }
}