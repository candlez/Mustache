const shucker = function(map, initialRequest) {
    var obj = {keys: []}
    for (const key of map.keys()) {
        if (map.get(key).changed || initialRequest) {
            obj.keys.push(key);
            var agent = map.get(key)
            if (agent.state == "alive") {
                obj[key] = {
                    x: agent.x,
                    y: agent.y,
                    mass: agent.mass,
                    state: "alive",
                }
            } else {
                obj[key] = {
                    state: agent.state,
                }
            } 
        }
        
    }
    return obj;
}

module.exports = shucker