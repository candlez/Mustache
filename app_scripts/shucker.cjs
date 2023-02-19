const agentShucker = function(agents, initialRequest) {
    var obj = {keys: []};
    for (const key of agents.keys()) {
        if (agents.get(key).changed || initialRequest) {
            obj.keys.push(key);
            var agent = agents.get(key)
            if (agent.state == "alive") {
                obj[key] = {
                    x: agent.x,
                    y: agent.y,
                    mass: agent.mass,
                    state: agent.state,
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

const gameObjectShucker = function(gameObjects, initialRequest) {
    var obj = {keys: []};
    for (const key of gameObjects.keys()) {
        if (gameObjects.get(key).changed || initialRequest) {
            obj.keys.push(key);
            var gameObject = gameObjects.get(key);
            if (gameObject.state == "alive") {
                if (gameObject.type == "electricityManager") {
                    obj[key] = {
                        x: gameObject.x,
                        y: gameObject.y,
                        bounds: gameObject.bounds,
                        max: gameObject.max,
                        type: gameObject.type,
                        state: gameObject.state
                    }
                } else {
                    obj[key] = {
                        x: gameObject.x,
                        y: gameObject.y,
                        type: gameObject.type,
                        state: gameObject.state
                    }
                }
            } else {
                obj[key] = {
                    state: gameObject.state
                }
            }
            
        }
    }
    return obj;
}


module.exports = {
    gameObjectShucker: gameObjectShucker,
    agentShucker: agentShucker,
}