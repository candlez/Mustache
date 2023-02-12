// timer functions
function resetChange(map, id) {
    map.get(id).changed = false;
}

function startTimer(map, id) {
    map.get(id).timer = setTimeout(resetChange, 250, map, id)
}

function resetTimer(map, id) {
    clearTimeout(map.get(id).timer);
    startTimer(map, id);
}

const changedTimeOut = function(map, id) {
    if (map.get(id).changed) {
        resetTimer(map, id);
    } else {
        map.get(id).changed = true;
        startTimer(map, id);
    }
}

module.exports = {changedTimeOut: changedTimeOut}