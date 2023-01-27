import {validateName} from "./name_validation.js";
import {displayError} from "./display_name_error.js";

function start(location) {
	var flag = true;
	try {
		var playerName = validateName(document.getElementById("nameBox").value);
	} catch(error) {
		flag = false;
		if (error.message == "period used") {
			displayError("Name Cannot Contain \".\"");
		} else if (error.message == "empty name") {
			displayError("Name Cannot Be Empty");
		} else {
			throw new Error(error.message);
		}
	}
	
	if (flag) {
		sessionStorage.setItem("playerName", playerName);
		window.location.assign(location);
	}
}

export {start};