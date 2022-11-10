export default class Image {
    /**
     * 
     * 
     * @param {String} id 
     * @param {String} source 
     * @param {HTML Element} parent 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(id, source, parent, width, height) {
        this.id = id;

        this.width = width;
        this.height = height;
        
        this.element = document.createElement('img');
        this.element.src = source;
        this.element.style.width = width + "px";
        this.element.style.height = height + "px";
        parent.appendChild(this.element);
    }

    /**
     * hides the image
     * 
     * @param {String} newDisplay - new display type
     */
    setDisplay(newDisplay) {
        this.element.style.display = newDisplay;
    }

    /**
     * setter method for the dimensions of the image
     * 
     * @param {Number} newWidth - the new width
     * @param {Number} newHeight - the new height
     */
    setDimensions(newWidth, newHeight) {
        this.element.style.width = newWidth + "px";
        this.element.style.height = newHeight + "px";
    }

    /**
     * changes the parent element that the image is attached to
     * 
     * @param {HTML Element} newParent - the new HTML element that will be the parent to this image
     */
    setParent(newParent) {
        this.element.remove();
        newParent.appendChild(this.element);
    }

    drawImageOnCanvas(ctx, xCoord, yCoord, width, height) {
        ctx.drawImage(this.element, xCoord, yCoord, width, height)
    }
}