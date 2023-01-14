const express = require('express')
const path = require('path')
const app = express()
const socket = require('socket.io')
const dataShucker = require('./public/pages/agario/scripts/shucker.cjs')


app.use(express.static('./public')) // static means it's a static website

// pathways --------------------------------------------------------------------------
app.get('/', (req, res) => {
    res.redirect('home')
})

app.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/pages/home/homepage.html'))
})

app.get('/agario', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/pages/agario/agario.html'))
})

const server = app.listen(5000, () => {
    console.log('server is listening on port 5000...')
})
// -----------------------------------------------------------------------------------
// socket stuff ----------------------------------------------------------------------
const io = socket(server)

// these represent a master list of agents and gameObjects in the game
var agents = new Map();
var gameObjects = new Map();

io.sockets.on('connection', (socket) => {
    socket.on("playerMoved", (data) => {
        var mass = agents.get(data.id).mass
        var properties = agents.get(data.id)
        agents.set(data.id, {x: data.x, y: data.y, mass: mass, properties: properties})

        // example code
        // you can alter stuff in here
        // right now, the message is just being broadcast as is
        // socket.broadcast.emit("playerMoved", data);

        // the code above does not send the message back to the original client
        // the code below would do that
        // io.sockets.emit("playerMoved", data);
    })

    socket.on("playerSpawned", (data) => {
        agents.set(data.id, {x: data.x, y: data.y, mass: data.mass, properties: data.properties})
    });

    socket.on("requestServerData", () => {
        var data = {
            agents: dataShucker(agents),
            gameObjects: dataShucker(gameObjects),
        }
        io.to(socket.id).emit("sentServerData", data);
    })

    socket.on("requestProperties", (data) => {
        console.log("properties requested from: " + socket.id)
        io.to(socket.id).emit("sentProperties", {id: data.id, properties: agents.get(data.id).properties})
    })
})
// -----------------------------------------------------------------------------------
