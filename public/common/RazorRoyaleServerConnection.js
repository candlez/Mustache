import RazorRoyaleGame from "../razor_royale_game/RazorRoyaleGame.js";
import ServerConnection from "./ServerConnection.js";
import Display from "./Display.js"

export default class RazorRoyaleServerConnection extends ServerConnection {


    constructor(socket) {
        super(socket);
    }

    static connect() {
        const server = new RazorRoyaleServerConnection(domain);
        
        return server;
    }

    // methods
    
    
    // waiting methods
    waitForSpawnElectricity() { // fix based on new scope
        this.getSocket().on("spawnElectricity", (data) => {
            this.spawnElectricity(data);
        })
    }
}