import Image from "../../../common/Image.js";

export default class ColorPickerHolder {
    #colorPickers
    #selectedPicker
    #marker

    constructor(selectedPicker) {
        this.#colorPickers = [selectedPicker];
        this.#selectedPicker = selectedPicker;
        selectedPicker.setColorPickerHolder(this);
        localStorage.setItem("playerColor", selectedPicker.getColor())

        this.#marker = new Image("marker", "../../../assets/checkmark.png", selectedPicker.getElement(), 40, 40);
    }

    // getters and setters
    getColorPickers() {
        return this.#colorPickers;
    }
    setSelectedPicker(newSelectedPicker) {
        this.#selectedPicker.toggle();
        this.#selectedPicker = newSelectedPicker;
        localStorage.setItem("playerColor", newSelectedPicker.getColor())
    }
    getSelectedPicker() {
        return this.#selectedPicker;
    }
    setMarker(newMarker) {
        this.#marker = newMarker;
    }
    getMarker() {
        return this.#marker;
    }

    // methods
    addColorPicker(colorPicker) {
        this.getColorPickers().push(colorPicker);
        colorPicker.setColorPickerHolder(this);
        if (colorPicker.getSelected()) {
            this.setSelectedPicker(colorPicker)
        }
    }
}