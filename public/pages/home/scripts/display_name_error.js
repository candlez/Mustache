function displayError(message) {
    var text = document.getElementById("errorText")
    if (text == undefined) {
        text = document.createElement("p");
        text.id = "errorText"
    }
    text.innerHTML = message;

    const nameBoxContainer = document.getElementById("nameBoxContainer");
    nameBoxContainer.appendChild(text);
    nameBoxContainer.style.backgroundColor = "orangered";
}

export {displayError};