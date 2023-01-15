export default class ColorPicker {
    #element
    #selected
    #color
    #colorPickerHolder

    constructor (element, startingSelected, color) {
        this.#element = element;
        this.#selected = startingSelected;
        this.#color = color;
        this.#colorPickerHolder = null;
        
        element.addEventListener("click", this)
    }

    // getters and setters
    setElement(newElement) {
        this.#element = newElement;
    }
    getElement() {
        return this.#element;
    }
    setSelected(newSelected) {
        this.#selected = newSelected;
    }
    getSelected() {
        return this.#selected;
    }
    getColor() {
        return this.#color;
    }
    setColorPickerHolder(newColorPickerHolder) {
        this.#colorPickerHolder = newColorPickerHolder;
    }
    getColorPickerHolder() {
        return this.#colorPickerHolder;
    }

    // methods

    handleEvent() {
        if (!this.getSelected()) {
            this.toggle();
        }
    }

    /**
     * toggles whether or not this ColorPicker is selected
     */
    toggle() {
        if (this.getSelected()) {
            this.setSelected(false);
        } else {
            this.setSelected(true);
            this.getColorPickerHolder().setSelectedPicker(this)
            this.getColorPickerHolder().getMarker().setParent(this.getElement())
        }
    }
}