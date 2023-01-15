import ColorPicker from "./ColorPicker.js";
import ColorPickerHolder from "./ColorPickerHolder.js";

const blue = new ColorPicker(
    document.getElementById("picker1"), 
    false, 
    document.getElementById("picker1").style.backgroundColor
)
const green = new ColorPicker(
    document.getElementById("picker2"), 
    false, 
    document.getElementById("picker2").style.backgroundColor
)
const yellow = new ColorPicker(
    document.getElementById("picker3"), 
    false, 
    document.getElementById("picker3").style.backgroundColor
)
const orange = new ColorPicker(
    document.getElementById("picker4"), 
    false, 
    document.getElementById("picker4").style.backgroundColor
)
const red = new ColorPicker(
    document.getElementById("picker5"), 
    false, 
    document.getElementById("picker5").style.backgroundColor
)

blue.setSelected(true)

const holder = new ColorPickerHolder(blue);
holder.addColorPicker(green);
holder.addColorPicker(yellow);
holder.addColorPicker(orange);
holder.addColorPicker(red);

export default holder;