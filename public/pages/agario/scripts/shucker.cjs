const shucker = function(map) {
    var obj = {keys: []}
    for (const key of map.keys()) {
        obj.keys.push(key);
        var agent = map.get(key)
        obj[key] = {
            id: key,
            x: agent.x,
            y: agent.y,
            mass: agent.mass,
        }
    }
    return obj;
}

module.exports = shucker