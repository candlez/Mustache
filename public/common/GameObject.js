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
    #properties;
    #image;

    // static property values
    static PROPERTIES = {
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

    static PROPERTYLESS = {
        opacity: GameObject.PROPERTIES.OPACITY.INVISIBLE,
        animation: {
            type: GameObject.PROPERTIES.ANIMATION.TYPE.NONE
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
        this.#xCoord = newXCoord;
        
    }
    getXCoord() {
        return this.#xCoord;
    }
    setYCoord(newYCoord) {
        this.#yCoord = newYCoord;
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
        if (this.getProperties().animation.width != undefined) {
            return this.getProperties().animation.width;
        } else if (this.getProperties().animation.radius != undefined) {
            return this.getProperties().animation.radius * 2;
        } else {
            throw new Error("this GameObject has no width or radius")
        }
    }
    setHeight(newHeight) {
        this.#properties.animation.height = newHeight;
    }
    getHeight() {
        if (this.getProperties().animation.height != undefined) {
            return this.getProperties().animation.height;
        } else if (this.getProperties().animation.radius != undefined) {
            return this.getProperties().animation.radius * 2;
        } else {
            throw new Error("this GameObject has no height or radius")
        }
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
        var xFlag;
        var yFlag;
        // console.log(bounds, xCoord, yCoord)

        if (xCoord == undefined) {
            xFlag = true;
        } else {
            xFlag = xCoord > bounds.left && xCoord < bounds.right;
        }
        if (yCoord == undefined) {
            yFlag = true;
        } else {
            yFlag = yCoord > bounds.top && yCoord < bounds.bottom;
        }
        return xFlag && yFlag;
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
                return this.isWithinRectangleBounds(xCoord, yCoord);
            case 2: // rectangle
                return this.isWithinRectangleBounds(xCoord, yCoord);
            case 3: // circle
                return this.isWithinCircleBounds(xCoord, yCoord);
        }
    }

    /**
     * changes the absolute coordinates of the Agent
     * 
     * @param {Number} xChange - the change to the xCoords
     * @param {Number} yChange - the change to the yCoords
     */
    move(xChange, yChange) {
        var newX = this.getXCoord() + xChange;
        var newY = this.getYCoord() + yChange;
        const halfX = this.getWidth() / 2;
        const halfY = this.getHeight() / 2;

        if (xChange > 0) {
            try {
                this.getGame().pointValidation(newX + halfX, newY);
                this.getGame().pointValidation(newX + halfX, this.getYCoord() + halfY)
                this.getGame().pointValidation(newX + halfX, this.getYCoord() - halfY)
                this.getGame().pointValidation(newX, this.getYCoord())
            } catch (error) {
                if (error instanceof RangeError) {
                    if (error.message == "out of bounds") {
                        newX = error.cause.right - halfX;
                    } else {
                        newX = error.cause.left - halfX;
                    }
                } else {
                    throw new Error(error.message);
                }
            } 
        } else {
            try {
                this.getGame().pointValidation(newX - halfX, newY);
                this.getGame().pointValidation(newX - halfX, this.getYCoord() + halfY)
                this.getGame().pointValidation(newX - halfX, this.getYCoord() - halfY)
                this.getGame().pointValidation(newX, this.getYCoord())
            } catch (error) {
                if (error instanceof RangeError) {
                    if (error.message == "out of bounds") {
                        newX = error.cause.left + halfX;
                    } else {
                        newX = error.cause.right + halfX;
                    }
                } else {
                    throw new Error(error.message);
                }
            }
        }
        if (yChange > 0) {
            try {
                this.getGame().pointValidation(newX, newY + halfY);
                this.getGame().pointValidation(newX + halfX, newY + halfY);
                this.getGame().pointValidation(newX - halfX, newY + halfY);
                this.getGame().pointValidation(newX, newY);
            } catch (error) {
                if (error instanceof RangeError) {
                    if (error.message == "out of bounds") {
                        newY = error.cause.bottom - halfY;
                    } else {
                        newY = error.cause.top - halfY;
                    }
                } else {
                    throw new Error(error.message);
                }
            }
        } else {
            try {
                this.getGame().pointValidation(newX, newY - halfY);
                this.getGame().pointValidation(newX + halfX, newY - halfY);
                this.getGame().pointValidation(newX - halfX, newY - halfY);
                this.getGame().pointValidation(newX, newY);
            } catch (error) {
                if (error instanceof RangeError) {
                    if (error.message == "out of bounds") {
                        newY = error.cause.top + halfY;
                    } else {
                        newY = error.cause.bottom + halfY;
                    }
                } else {
                    throw new Error(error.message);
                }
            }
        }
        this.setXCoord(newX);
        this.setYCoord(newY);
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