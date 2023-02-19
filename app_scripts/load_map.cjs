const fs = require('fs/promises');
const timers = require('./timers.cjs');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function readJSON(fileName) {
    var data = await fs.readFile(fileName);
    return JSON.parse(data);
}

const getRandomMapID = async function(mapFolder) {
    return await readJSON('./map_presets/' + mapFolder + '/map_presets.json');
}

const getMapDataByID = async function(mapFolder, mapID) {
    return await readJSON('./map_presets/' + mapFolder + '/' + mapID + '/game_objects.json');
}

const loadMap = async function(objectMap, mapFolder) {
    const mapArray = await getRandomMapID(mapFolder);
    const mapID = mapArray.mapPresets[getRandomInt(mapArray.mapPresets.length)].folderName;
    const map = await getMapDataByID(mapFolder, mapID);
    for (var i = 0; i < map.gameObjects.length; i++) {
        var object = map.gameObjects[i]
        if (object.type == "wall") {
            objectMap.set(object.id, {
                type: object.type,
                x: object.xCoord,
                y: object.yCoord,
                properties: object.properties,
                state: "alive",
                changed: false,
                timer: null
            });
        } else if (object.type == "electricityManager") {
            objectMap.set(object.id, {
                type: object.type,
                x: object.xCoord,
                y: object.yCoord,
                bounds: object.bounds,
                max: object.max,
                state: "alive",
                changed: false,
                timer: null
            });
        }
        timers.changedTimeOut(objectMap, object.id);
    }
    console.log(objectMap)
}


module.exports = {
    loadMap: loadMap,
    getRandomMapID: getRandomMapID,
    getMapDataByID: getMapDataByID
}