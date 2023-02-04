const express = require('express')
const path = require('path')
const app = express()
const socket = require('socket.io')
const dataShucker = require('./public/pages/agario/scripts/shucker.cjs')
const data = require('./map_presets/razor_royale_one/game_objects.json')
const readData = require('./public/pages/razor_royale/scripts/read_data.cjs')


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

app.get('/razor_royale', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/pages/razor_royale/razor_royale.html'))
})

const server = app.listen(443, () => {
    console.log('server is listening on port 5000...')
})
// -----------------------------------------------------------------------------------
// socket stuff ----------------------------------------------------------------------
const io = socket(server)

// these represent a master list of agents and gameObjects in the game
var agents = new Map();
var gameObjects = readData(data);

// set linking socket ids to player ids
var socketToID = new Map();

// timer functions
function resetChange(id) {
    agents.get(id).changed = false;
}

function startTimer(id) {
    agents.get(id).timer = setTimeout(resetChange, 250, id)
}

function resetTimer(id) {
    clearTimeout(agents.get(id).timer);
    startTimer(id);
}

function changedTimeOut(id) {
    if (agents.get(id).changed) {
        resetTimer(id);
    } else {
        agents.get(id).changed = true;
        startTimer(id);
    }
}

io.sockets.on('connection', (socket) => {
    socket.on("requestPlayerID", (data) => {
        var combinedID = data.id + "." + socket.id;
        io.to(socket.id).emit("sentPlayerID", combinedID)
    });

    socket.on("playerMoved", (data) => {
        agents.get(data.id).x = data.x;
        agents.get(data.id).y = data.y;
        changedTimeOut(data.id);

        // example code
        // you can alter stuff in here
        // right now, the message is just being broadcast as is
        // socket.broadcast.emit("playerMoved", data);

        // the code above does not send the message back to the original client
        // the code below would do that
        // io.sockets.emit("playerMoved", data);
    });

    socket.on("playerEaten", (data) => {

    });

    socket.on("playerSpawned", (data) => {
        agents.set(data.id, {
            x: data.x, 
            y: data.y, 
            mass: data.mass, 
            properties: data.properties,
            state: "alive",
            changed: false,
            timer: null,
        });
        socketToID.set(socket.id, data.id);
        changedTimeOut(data.id);
    });

    socket.on("requestServerData", (initialRequest) => {
        var returnData = {
            agents: dataShucker(agents, initialRequest),
            gameObjects: dataShucker(gameObjects, initialRequest),
        }
        io.to(socket.id).emit("sentServerData", returnData);
    })

    socket.on("requestProperties", (data) => {
        console.log("properties for: " + data.id + " requested from: " + socket.id)
        io.to(socket.id).emit("sentProperties", {id: data.id, properties: agents.get(data.id).properties})
    })

    socket.on("disconnect", (reason) => {
        console.log(socket.id + " has disconnected, this is why: " + reason);
        socket.broadcast.emit("playerDisconnected", socketToID.get(socket.id));
        agents.delete(socketToID.get(socket.id));
        socketToID.delete(socket.id);
    })
})
// -----------------------------------------------------------------------------------
