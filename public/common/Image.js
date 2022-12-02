

/**
 * this is an Image
 */
export default class Image {
    // fields
    #id;
    #element;
    #width;
    #height;
    #loaded;

    /**
     * initializes an Image object
     * 
     * @param {String} id - the unique ID of this Image
     * @param {String} source - the path to the image file
     * @param {HTML Element} parent - the HTML Element that this image element exists under
     * @param {Number} width - the width of the Image
     * @param {Number} height - the height of the Image
     */
    constructor(id, source, parent, width, height) {
        this.#id = id;

        this.#width = width;
        this.#height = height;
        
        this.#element = document.createElement('img');
        this.#element.src = source;
        this.#element.style.width = width + "px";
        this.#element.style.height = height + "px";
        parent.appendChild(this.#element);
    }

    // standard getters and setters
    setWidth(newWidth) {
        this.#width = newWidth;
        this.#element.style.width = newWidth + 'px';
    }
    getWidth() {
        return this.#width;
    }
    setHeight(newHeight) {
        this.#height = newHeight;
        this.#element.style.height = newHeight + 'px';
    }
    getHeight() {
        return this.#height;
    }
    getId() {
        return this.#id;
    }
    getElement() {
        return this.#element;
    }

    // real methods
    /**
     * sets the source of the Image object
     * 
     * @param {String} newSource - the path to the new source image
     */
    setSource(newSource) {
        this.#element.src = newSource;
    }

    /**
     * gets the source of the Image object
     * 
     * @returns - the path of the source image
     */
    getSource() {
        return this.element.src;
    }

    /**
     * hides the image
     * 
     * @param {String} newDisplay - new display type
     */
    setDisplay(newDisplay) {
        this.#element.style.display = newDisplay;
    }

    /**
     * changes the parent element that the image is attached to
     * 
     * @param {HTML Element} newParent - the new HTML element that will be the parent to this image
     */
    setParent(newParent) {
        this.#element.remove();
        newParent.appendChild(this.#element);
    }

    /**
     * draws the image on the the given canvas
     * 
     * @param {Context} ctx - the context being used to draw the Image
     * @param {Number} xCoord - the location on the canvas that Image is being drawn at
     * @param {Number} yCoord - the location on the canvas that Image is being drawn at
     * @param {Number} width - the width of the Image as it is being drawn
     * @param {Number} height - the height of the Image is it is being drawn
     */
    drawImageOnCanvas(ctx, xCoord, yCoord, width, height) {
        ctx.drawImage(this.getElement(), xCoord, yCoord, width, height)
    }
}