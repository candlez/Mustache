var gameState = false;
var playSpace = document.getElementById("playSpace");
var psctx = playSpace.getContext("2d");
playSpace.width = 2000;
playSpace.height = 2000;
var map = document.getElementById("map");
var mctx = map.getContext("2d");
map.width = 2000;
map.height = 2000;

var agars = [];
var renderedAgars = [];

class Map {
	constructor(x, y, width, height, scale) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.scale = scale;
	}
	drawMap() {
		mctx.beginPath();
		var diffx = (this.width / 2) * this.scale
		var diffy = (this.height / 2) * this.scale
		mctx.rect(0, 0, this.width * this.scale, this.height * this.scale);
		mctx.stroke();
		var a = 1
		while (a < 10) {
			mctx.beginPath();
			var b = a * 200 * this.scale;
			mctx.moveTo(b, 0);
			mctx.lineTo(b, this.height);
			mctx.stroke();
			a ++;
		} 
		a = 1
		while (a < 10) {
			mctx.beginPath;
			b = a * 200 * this.scale;
			mctx.moveTo(0, b);
			mctx.lineTo(this.width, b);
			mctx.stroke();
			a ++;
		}
	}
}
class Agar {
	constructor(x, y, mass, color) {
		this.x = x;
		this.y = y;
		this.mass = mass;
		this.color = color;
		agars.push(this);
	}
	drawAgar() {
		psctx.beginPath();
		psctx.arc(this.x, this.y, this.mass, 0, Math.PI * 2);
		psctx.fillStyle = this.color;
		psctx.fill();
	}
	moveAgar(direction) {
		a = [[0, 1], [1, 0], [0, -1], [-1, 0]]

	}
}
function updatePlayerCords() {
	if (keysDown.up) {
		player.y = player.y - 10
	}
	if (keysDown.right) {
		player.x = player.x + 10
	}
	if (keysDown.down) {
		player.y = player.y + 10
	}
	if (keysDown.left) {
		player.x = player.x - 10
	}
}
function drawFrame() {
	updatePlayerCords();
	map1.drawMap();
	player.drawAgar();
	for (agar in agars) {
		agars[agar].drawAgar();
	}
	if (gameState) {
		window.requestAnimationFrame(drawFrame);
	}
}
function startGame() {
	gameState = true;
	document.getElementById("paragraph").style.display = "none";
	document.getElementById("pressMe").style.display = "none";
	map1 = new Map (0 , 0, map.width, map.height, 1);
	player = new Agar(playSpace.width / 2, playSpace.height / 2, 40, "blue");
	agars.push(player);
	random = new Agar((playSpace.width / 2) + 400, playSpace.height / 2, 40, "red");
	agars.push(random);
	window.requestAnimationFrame(drawFrame);
	startWASD();
}
function drawLine() {
	psctx.moveTo(2000, 0);
	psctx.lineTo(0, 2000);
	psctx.stroke();
}
// drawLine();