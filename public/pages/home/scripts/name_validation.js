function validateName(name) {
    if (name.indexOf(" ") == 0) {
        return validateName(name.substring(1))
    }
    if (name == "") {
        throw new Error("empty name");
    }
    if (name.indexOf(".") != -1) {
        throw new Error("period used");
    }
    return name;
}

export {validateName}