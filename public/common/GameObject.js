import Image from "./Image.js";

/**
 * a GameObject is a drawable item that exists at a specific location in a game
 */
export default class GameObject {
    // fields
    #id;
    #game;
    #ctx
    #xCoord;
    #yCoord;
    #canvasCoords;
    #properties;
    #image;

    // static property values
    static PROPERTIES = {
        // to-do add static properties to compare to
        ANIMATION: {
            TYPE: {
                NONE: 0,
                IMAGE: 1,
                RECTANGLE: 2,
                CIRCLE: 3,
            },
        },
        OPACITY: {
            INVISIBLE: 0,
            BLOCKING: 1,
        }
    }

    /**
     * initializes a new GameObject object
     * 
     * @param {AnimatedGame} game - the game to which this GameObject belongs
     * @param {Number} xCoord - the absolute position of the GameObject
     * @param {Number} yCoord - the absolute position of the GameObject
     * @param {Object} properties - 
     */
    constructor(id, game, xCoord, yCoord, properties) {
        this.#id = id;
        this.#game = game;
        this.#ctx = game.getCTX();
        this.#xCoord = xCoord;
        this.#yCoord = yCoord;
        this.#canvasCoords = {x: null, y: null};
        GameObject.propertyValidation(properties);
        this.#properties = properties;
        if (properties.animation.type == GameObject.PROPERTIES.ANIMATION.TYPE.IMAGE) { // sets the image field
            this.#image = new Image(
                id, 
                properties.animation.source, 
                game.getAssetContainer().getContainer(), 
                properties.animation.width, 
                properties.animation.height
            );
        }
    }
    
    // static methods

    static propertyValidation(properties) {
        if (properties == undefined) {
            throw new TypeError("GameObject has no properties");
        }
        // animation property validation
        if (properties.animation == undefined) {
            throw new TypeError("GameObject has no animation properties");
        }
        if (typeof properties.animation.type != "number") {
            throw new TypeError("Animation Type is not a number");
        } else {
            switch (properties.animation.type) {
                case 0: // requirements for none
                    break;
                case 1: // requirements for image
                    if (typeof properties.animation.source != "string") {
                        throw new TypeError("Image source invalid");
                    } else if (typeof properties.animation.width != "number") {
                        throw new TypeError("Image width invalid");
                    } else if (typeof properties.animation.height != "number") {
                        throw new TypeError("Image height invalid");
                    }
                    break;
                case 2: // requirements for rectangle
                    if (typeof properties.animation.width != "number") {
                        throw new TypeError("Rectangle width invalid");
                    } else if (typeof properties.animation.height != "number") {
                        throw new TypeError("Rectangle height invalid");
                    } else if (typeof properties.animation.color != "string") {
                        throw new TypeError("GameObject's color is invalid");
                    }
                    break;
                case 3: // requirements for circle
                    if (typeof properties.animation.radius != "number") {
                        throw new TypeError("Circle radius invalid");
                    } else if (typeof properties.animation.color != "string") {
                        throw new TypeError("Circle color is invalid");
                    }
            }
        }
        // opacity
        if (properties.opacity == undefined) {
            throw new TypeError("GameObject has no opacity")
        }
        if (typeof properties.opacity != "number") {
            throw new TypeError("Opacity is not a number");
        }

    }

    // standard getters and setters
    setID(newID) {
        this.#id = newID;
    }
    getID() {
        return this.#id;
    }
    getGame() {
        return this.#game;
    }
    setXCoord(newXCoord) {
        var half = this.getWidth() / 2
        var bounds = this.getGame().getMap().getBounds();
        if (newXCoord - half < bounds.left) {
            throw new RangeError("left bound violated");
        } else if (newXCoord + half >  bounds.right) {
            throw new RangeError("right bound violated");
        } else {
            this.#xCoord = newXCoord;
        }
        
    }
    getXCoord() {
        return this.#xCoord;
    }
    setYCoord(newYCoord) {
        var half = this.getHeight() / 2
        var bounds = this.getGame().getMap().getBounds();
        if (newYCoord - half < bounds.top) {
            throw new RangeError("top bound violated");
        } else if (newYCoord + half >  bounds.bottom) {
            throw new RangeError("bottom bound violated");
        } else {
            this.#yCoord = newYCoord;
        }
    }
    getYCoord() {
        return this.#yCoord;
    }
    getCanvasCoords(scale) {
        return {
            x: 1000 + (scale * (this.getXCoord() - this.getGame().getPlayer().getXCoord())),
            y: 1000 + (scale * (this.getYCoord() - this.getGame().getPlayer().getYCoord()))
        }
    }
    getCTX() {
        return this.#ctx;
    }
    setImage(newImage) {
        this.#image = newImage;
    }
    getImage() {
        return this.#image;
    }
    // property getters and setters
    setProperties(newProperties) {
        GameObject.propertyValidation(newProperties);
        this.#properties = newProperties;
    }
    getProperties() {
        return this.#properties;
    }
    setOpacity(newOpacity) {
        this.#properties = newOpacity;
    }
    getOpacity() {
        return this.getProperties().opacity;
    }
    getAnimationType() {
        return this.getProperties().animation.type;
    }
    getBounds() {
        const halfX = this.getWidth() / 2;
		const halfY = this.getHeight() / 2;
        return {
            top: this.getYCoord() - halfY,
            bottom: this.getYCoord() + halfY,
            left: this.getXCoord() - halfX,
            right: this.getXCoord() + halfX
        }
    }
    setRadius(newRadius) {
        this.#properties.animation.radius = newRadius;
    }
    getRadius() {
        return this.getProperties().animation.radius;
    }
    getColor() {
        return this.getProperties().animation.color;
    }
    setWidth(newWidth) {
        this.#properties.animation.width = newWidth;
    }
    getWidth() {
        return this.getProperties().animation.width;
    }
    setHeight(newHeight) {
        this.#properties.animation.height = newHeight;
    }
    getHeight() {
        return this.getProperties().animation.height;
    }
    setColor(newColor) {
        this.#properties.animation.color = newColor;
    }
    getColor() {
        return this.getProperties().animation.color;
    }

    // actual methods

    isWithinCircleBounds(xCoord, yCoord) {
        const radius = this.getRadius();
        const xDiff = this.getXCoord() - xCoord;
        const yDiff = this.getYCoord() - yCoord;
        return (radius * radius > (xDiff * xDiff) + (yDiff * yDiff));
    }

    isWithinRectangleBounds(xCoord, yCoord) {
        const bounds = this.getBounds();
        return (xCoord > bounds.left || xCoord < bounds.right || yCoord > bounds.top || yCoord < bounds.bottom);
    }

    /**
     * 
     * @param {Number} xCoord - xCoord being tested
     * @param {NUmber} yCoord - yCoord being tested
     * @returns - whether or not the point is within the bounds of the object
     */
    isPointWithinBounds(xCoord, yCoord) {
        switch (this.getAnimationType()) {
            case 0: // none
                throw new TypeError("GameObject has no bounds");
            case 1: // image
                return this.isPointWithinBounds(xCoord, yCoord);
            case 2: // rectangle
                return this.isPointWithinBounds(xCoord, yCoord);
            case 3: // circle
                return this.isWithinCircleBounds(xCoord, yCoord);
        }

    }

    /**
     * 
     * @param {Error} error 
     * @param {Object} bounds 
     * @returns 
     */
    movementErrorCorrection(error, bounds) {
        if (error.message == "left bound violated") {
            return bounds.left + (this.getWidth() / 2);
        } else if (error.message == "right bound violated") {
            return bounds.right - (this.getWidth() / 2);
        } else if (error.message == "top bound violated") {
            return bounds.top + (this.getHeight() / 2);
        } else if (error.message == "bottom bound violated") {
            return bounds.bottom - (this.getHeight() / 2);
        } else {
            throw new Error(error.message);
        }
    }

    /**
     * changes the absolute coordinates of the Agent
     * 
     * @param {Number} xChange - the change to the xCoords
     * @param {Number} yChange - the change to the yCoords
     */
    move(xChange, yChange) {
        var bounds = this.getGame().getMap().getBounds();
        try {
            this.setXCoord(this.getXCoord() + xChange);
        } catch (error) {
            this.setXCoord(this.movementErrorCorrection(error, bounds));
        }
        try {
            this.setYCoord(this.getYCoord() + yChange);
        } catch (error) {
            this.setYCoord(this.movementErrorCorrection(error, bounds));
        }
    }

    /**
     * draws the GameObject on the canvas of the game to which it belongs
     * 
     * @param {Number} scale - the scale the GameObject is drawn at
     */
    draw(scale) { // to-do -- update for properties
        const ctx = this.getCTX();
        switch (this.getAnimationType()) {
            case 0: // none
                // not sure this is necessary, might be easier to just let it pass over type: none
                // throw new TypeError("this object cannot be drawn");
                break;
            case 1: // image
                var canvasCords = this.getCanvasCoords();
                this.getImage().drawImageOnCanvas(
                    ctx, 
                    canvasCords.x, 
                    canvasCords.y, 
                    this.getWidth() * scale,
                    this.getHeight() * scale
                );
            case 2: // rectangle
                var canvasCoords = this.getCanvasCoords(scale);
                ctx.beginPath();
                ctx.rect(
                    canvasCoords.x - ((this.getWidth() * scale) / 2),
                    canvasCoords.y - ((this.getHeight() * scale) / 2),
                    this.getWidth() * scale,
                    this.getHeight() * scale
                );
                ctx.fillStyle = this.getColor();
                ctx.fill();
            case 3: // circle
                var canvasCoords = this.getCanvasCoords(scale);
                ctx.beginPath();
                ctx.arc(
                    canvasCoords.x,
                    canvasCoords.y,
                    this.getRadius() * scale,
                    0,
                    2 * Math.PI
                );
                ctx.fillStyle = this.getColor();
                ctx.fill();
        }
    }
}