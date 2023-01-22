function startGame() {
	sessionStorage.setItem("playerName", document.getElementById("nameBox").value);

	window.location.assign("http://localhost:5000/razor_royale")
}

function startAgario() {
	sessionStorage.setItem("playerName", document.getElementById("nameBox").value);

	window.location.assign("http://localhost:5000/agario")
}

export {startGame, startAgario};