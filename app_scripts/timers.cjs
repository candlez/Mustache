// timer functions
function resetChange(map, id) {
    map.get(id).codes.shift();
    map.get(id).changed = false;
}

function startTimer(map, id) {
    setTimeout(resetChange, 250, map, id);
}


const changedTimeOut = function(map, id, code) {
    obj = map.get(id);
    index = obj.codes.indexOf(code);
    if (index != -1) {
        obj.codes.splice(index, 1);
        clearTimeout(obj.timers[index]);
    }
    map.get(id).codes.push(code);
    map.get(id).changed = true;
    startTimer(map, id);
}

module.exports = {changedTimeOut: changedTimeOut}