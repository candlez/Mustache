const express = require('express')
const path = require('path')
const app = express()
const socket = require('socket.io')

// app specific
const dataShucker = require('./app_scripts/shucker.cjs')
const timers = require('./app_scripts/timers.cjs')
const mapLoadingFunctions = require('./app_scripts/load_map.cjs')
// const spawnElectricity = require('./app_scripts/razor_royale/spawn_electricity.cjs')


app.use(express.static('./public')) // static means it's a static website

// pathways --------------------------------------------------------------------------
app.get('/', (req, res) => {
    res.redirect('testing')
})

app.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/pages/home/homepage.html'))
})

app.get('/agario', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/pages/agario/agario.html'))
})

app.get('/razor_royale', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/pages/razor_royale/razor_royale.html'))
})

app.get('/testing', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/pages/new_testing/testing.html'))
})

const server = app.listen(80, () => {
    console.log('server is listening on port 80...')
})
// -----------------------------------------------------------------------------------
// socket stuff ----------------------------------------------------------------------
const io = socket(server);
const GameObject = require('./app_scripts/GameObject.cjs');
const Game = require('./app_scripts/Game.cjs');

const game = new Game(io, {width: 2000} /*{width: 25000}*/);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const colors = ["cyan", "lime", "violet"];

// for (var i = 0; i < 1000; i++) {
//     game.addGameObject(new GameObject(i.toString(), "square", false, 
//         getRandomInt(24000), getRandomInt(24000), {size: getRandomInt(1000), color: colors[getRandomInt(3)]})
//     );
// }



// mapLoadingFunctions.loadMap(gameObjects, "razor_royale_maps")
game.start();
io.sockets.on('connection', (socket) => {
    console.log(socket.id);
    game.addUser(socket);
});
// -----------------------------------------------------------------------------------
