

export default class Display {
    // fields
    #height;
    #width;
    #canvas;
    #ctx;

    #scale;
    #backgroundColor;

    #animationManagers;

    #isActive;

    // these are under review
    #assetContainer;

    #game;
    #connection; // should these be initialized in the constructor or in a static method?


    constructor(width, height, xCoord, yCoord) { // to do, specify location of Display
        this.#width = width;
        this.#height = height;

        this.#canvas = document.createElement('canvas');
        this.#canvas.id = "playSpace"; // this isn't necessarily true
        this.#canvas.width = width;
        this.#canvas.height = height;
        document.body.appendChild(this.#canvas);
        this.#canvas.style.left = xCoord;
        this.#canvas.style.top = yCoord;
        

        this.#ctx = this.#canvas.getContext('2d');

        this.#scale = 1;
        this.#backgroundColor = "white";

        this.#animationManagers = [];

        this.#isActive = true;
    }


    static createFullScreen() { // this should vary based on the aspects of the window being used
        return new Display(window.innerWidth, window.innerHeight);
    }

    // getters and setters
    setXCoord(newXCoord) {
        this.getCanvas().style.left = newXCoord;
    }
    getXCoord() {
        return this.getCanvas().style.left;
    }
    setYCoord(newYCoord) {
        this.getCanvas().style.top = newYCoord;
    }
    getYCoord() {
        return this.getCanvas().style.top;
    }
    getHeight() {
        return this.#height;
    }
    getWidth() {
        return this.#width;
    }
    getCanvas() {
        return this.#canvas;
    }
    getCTX() {
        return this.#ctx;
    }
    setScale(newScale) {
        this.#scale = newScale;
    }
    getScale() {
        return this.#scale;
    }
    setBackgroundColor(newBackgroundColor) {
        this.#backgroundColor = newBackgroundColor;
    }
    getBackgroundColor() {
        return this.#backgroundColor;
    }
    getAnimationManagers() {
        return this.#animationManagers;
    }
    setIsActive(newIsActive) {
        this.#isActive = newIsActive;
    }
    getIsActive() {
        return this.#isActive;
    }


    // methods
    /**
     * draws a frame based on currently available data
     */
    // animateFrame() { // fix based on new scope
    //     this.intrepretTestingKeys()
    //     this.updatePositionData();
    //     this.requestServerData(false);
    //     this.adjustScale();
    //     this.clearPlaySpace(this.getMap().getBackgroundColor()); // erase everything from the previous frame
    //     this.drawObjects(); // draw the objects
    // }

    // this needs to become an Animation class

    // loadingScreenAnimation(counter) { // fix based on new scope
    //     var counterMod = counter % 600
    //     var text = "loading"
    //     var textMod = Math.floor((counterMod % 200) / 50);
    //     while (textMod > 0) {
    //         text += " .";
    //         textMod--;
    //     }
    //     if (counterMod < 301) { // animations
    //         this.clearPlaySpace("white");
    //         const ctx = this.getCTX();
    //         const center = {
    //             x: this.getWidth() / 2,
    //             y: this.getHeight() / 2,
    //         }
    //         const radius = 200
    //         ctx.beginPath();
    //         ctx.arc(center.x,center.y, radius, 1.5 * Math.PI, (1.5 * Math.PI) + ((counterMod / 300) * 2 * Math.PI), false);
    //         ctx.lineWidth = 30;
    //         ctx.stroke();
    //         ctx.font = "50px Spectral";
    //         ctx.textAlign = "center";
    //         ctx.textBaseline = "middle";
    //         ctx.fillStyle = "black";
    //         ctx.fillText(text, center.x, center.y);
    //     } else {
    //         this.clearPlaySpace("white");
    //         const ctx = this.getCTX();
    //         const center = {
    //             x: this.getWidth() / 2,
    //             y: this.getHeight() / 2,
    //         }
    //         const radius = 200
    //         ctx.beginPath();
    //         ctx.arc(center.x,center.y, radius, (1.5 * Math.PI) + ((counterMod / 300) * 2 * Math.PI), 1.5 * Math.PI, false);
    //         ctx.lineWidth = 30;
    //         ctx.stroke();
    //         ctx.lineWidth = 30;
    //         ctx.stroke();
    //         ctx.font = "50px Spectral";
    //         ctx.textAlign = "center";
    //         ctx.textBaseline = "middle";
    //         ctx.fillStyle = "black";
    //         ctx.fillText(text, center.x, center.y);
    //     }
    // }

    gameAnimationLoop() { // fix based on new scope
        const game = this;
        
        function animationLoop() {
            game.animateFrame();
            if (game.getGameState() == "alive") {
                requestAnimationFrame(animationLoop);
            }
        }
        requestAnimationFrame(animationLoop);
    }

    
    // methods from UML
    addAnimationManager(newAnimationManager, index) {
        if (index == undefined) {
            this.#animationManagers.push(newAnimationManager);
        } else {
            this.#animationManagers.splice(index, 0, newAnimationManager);
        }
    }

    removeAnimationManager(index) {
        this.#animationManagers.splice(index, 1);
    }

    /**
     * clears the display of any drawings on it
     */
    clear() {
        const ctx = this.getCTX();
        ctx.beginPath();
        ctx.rect(0, 0, this.getWidth(), this.getHeight());
        ctx.fillStyle = this.getBackgroundColor();
        ctx.fill();
    }

    animateFrame() {
        this.getAnimationManagers().forEach((animationManager) => {
            animationManager.animateFrame(this.getCTX(), this.getScale());
        })
    }

    startAnimationLoop() {
        this.setIsActive(true);

        const display = this;

        function animationLoop() {
            display.clear();
            display.animateFrame();
            if (display.getIsActive()) {
                requestAnimationFrame(animationLoop);
            }
        }
        requestAnimationFrame(animationLoop);
    }

    stopAnimationLoop() {
        this.setIsActive(false);
    }

    delete() {
        // finish this later
    }
}