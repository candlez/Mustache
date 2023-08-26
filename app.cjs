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

const players = new Map();
const gameObjects = new Map();

const playerTimers = new Map();

const socketToID = new Map();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
for (var i = 0; i < 1000; i++) {
    gameObjects.set(i.toString(), 
        new GameObject(i.toString(), "square", false, 
            getRandomInt(24000), getRandomInt(24000), {size: getRandomInt(1000), color: "blue"}
        )
    );
}



// mapLoadingFunctions.loadMap(gameObjects, "razor_royale_maps")

io.sockets.on('connection', (socket) => {
    // socketIDs.push(socket.id);
    // console.log(socketIDs);

    socket.on("initializingGame", (data) => {
        // here is where the width is decided
        // more information can be included in this message if necessary
        const width = 25000;
        io.to(socket.id).emit("gameConstructorValuesSent", width)
    });


    socket.on("requestingIds", () => {
        var ids = [];
        for (const id of players.keys()) {
            ids.push(id);
        }
        for (const id of gameObjects.keys()) {
            ids.push(id);
        }
        io.to(socket.id).emit("idsSent", ids)
    });


    socket.on("requestingDataById", (id) => {
        if (players.has(id)) {
            io.to(socket.id).emit(id + "DataSent", players.get(id).getArguments());
        } else if (gameObjects.has(id)) {
            io.to(socket.id).emit(id + "DataSent", gameObjects.get(id).getArguments());
        } else {
            // wah wah wah
        }
    });


    socket.on("requestingPlayerID", (data) => {
        var combinedID = data + "." + socket.id;
        io.to(socket.id).emit("sentPlayerID", combinedID)
    });


    socket.on("playerSpawned", (data) => {
        players.set(data.id, new GameObject(data.id, data.type, data.dynamic, data.x, data.y, data.args));
        playerTimers.set(data.id, {timers: [], changed: false, codes: []}); // ewww
        timers.changedTimeOut(playerTimers, data.id, "spawned");
        socketToID.set(socket.id, data.id);
    });


    socket.on("playerMoved", (data) => {
        players.get(data.id).x = data.x;
        players.get(data.id).y = data.y;
        timers.changedTimeOut(playerTimers, data.id, "moved")
    });


    socket.on("playerSizeChanged", (data) => {
        players.get(data.id).size = data.size;
        timers.changedTimeOut(playerTimers, data.id, "sizeChanged")
    });


    socket.on("requestingChanges", () => { // this needs to support more than one code
        // console.log("Marco")
        for (const entry of playerTimers.entries()) {
            var data = players.get(entry[0])
            if (entry[1].changed && entry[0] != socketToID.get(socket.id)) {
                // console.log(entry[1].codes);
                if (entry[1].codes.includes("spawned")) {
                    io.to(socket.id).emit("spawned", data);
                }
                if (entry[1].codes.includes("moved")) {
                    io.to(socket.id).emit("moved", {id: data.id, x: data.x, y: data.y});
                }
                if (entry[1].codes.includes("sizeChanged")) {
                    io.to(socket.id).emit("sizeChanged", {id: data.id, size: data.size});
                }
            }
        }
    });


    // review
    socket.on("disconnect", (reason) => {
        console.log(socket.id + " has disconnected,reason: " + reason);
        // socket.broadcast.emit("playerDisconnected", socketToID.get(socket.id));
        socketToID.delete(socket.id);
    });
})
// -----------------------------------------------------------------------------------
