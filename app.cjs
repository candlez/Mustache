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
    console.log(socket)
})
// -----------------------------------------------------------------------------------
