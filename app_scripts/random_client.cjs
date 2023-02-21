

const emitToRandomClient = function(io, message, data, socketIDs) {
    var index = Math.floor(Math.random() * socketIDs.length);
    io.to(socketIDs[index]).emit(message, data);
}

module.exports = emitToRandomClient;