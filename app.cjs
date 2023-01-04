const express = require('express')
const path = require('path')
const app = express()
const socket = require('socket.io')


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

io.sockets.on('connection', (socket) => {
    console.log(socket.id)

    socket.on("playerMoved", (data) => {
        // you can alter stuff in here
        // right now, the message is just being broadcast as is
        socket.broadcast.emit("playerMoved", data);

        // the code above does not send the message back to the original client
        // the code below would do that
        // io.sockets.emit("playerMoved", data);
    })
})
// -----------------------------------------------------------------------------------
