const emitToRandom = require('./../random_client.cjs')

const spawnElectricity = function(io, socketIDs) {
    emitToRandom(io, "spawnElectricity", 1, socketIDs);
}


const electricitySpawner = function(io) {

}

module.exports = spawnElectricity;