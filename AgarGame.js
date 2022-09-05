/*
starts the game by creating game object
and calling its play game method
*/

var agarGame;

function startGame() {
	agarGame = new Game(document.getElementById("playSpace"));
	agarGame.playGame();
}


/*
thoughts:

main.js handles the general functions of the page
which include the buttons and other ui features

when the start button is pressed, a game object
is created

the game object creates the playspace and a map
object

the game is run entirely within the game object
with game methods, map methods, and agar methods

the map object creates the map canvas

general idea:
two sides,
1. keeping data up to date in the back end
2. animating current data on the screen
*/