import Controller from "./Controller.js";
import KeyLogger from "./KeyLogger.js";


export default class DemoController extends Controller {
    // fields


    constructor(game, display, connection) {
        super(game, display, connection);

        this.addKeyLogger("up", new KeyLogger("w"));
        this.addKeyLogger("left", new KeyLogger("a"));
        this.addKeyLogger("down", new KeyLogger("s"));
        this.addKeyLogger("right", new KeyLogger("d"));

        this.addKeyLogger("sizeUp", new KeyLogger("9"));
        this.addKeyLogger("sizeDown", new KeyLogger("0"));

        this.addKeyLogger("stopSending", new KeyLogger("8"));
    }



    interpretKeys() { // these ought to be broken up into different methods
        const refreshRate = this.getDisplay().getRefreshRate();
        const loggers = this.getKeyLoggers();
        const player = this.getGame().getPlayer();

        // movement
        const gameBounds = this.getGame().getBounds();
        const speed = player.getSpeed() / refreshRate;
        const unitVectors = [
            loggers.get("right").getKeyDown() + (-1 * loggers.get("left").getKeyDown()),
            loggers.get("down").getKeyDown() + (-1 * loggers.get("up").getKeyDown())
        ];

        if (unitVectors[0] != 0 && unitVectors[1] != 0) {
            unitVectors[0] *= speed * 7;
            unitVectors[1] *= speed * 7;
        } else {
            unitVectors[0] *= speed * 10;
            unitVectors[1] *= speed * 10;
        }
        const old = player.getVectors();
        player.setVectors(unitVectors);
        if (unitVectors[0] != old[0] || unitVectors[1] != old[1]) {
            console.log("emit vectors changed");
            this.getConnection().emitVectorsChanged();
        }
        

        // boundary collision
        // this needs to be moved into Game
        // because currently, boundary detection happens before movement is processed
        if (player.getXCoord() < 0) {
            player.setXCoord(0);
        }
        if (player.getXCoord() + player.getSize() > this.getGame().getWidth()) {
            player.setXCoord(this.getGame().getWidth() - player.getSize());
        }
        if (player.getYCoord() < 0) {
            player.setYCoord(0);
        }
        if (player.getYCoord() + player.getSize() > this.getGame().getWidth()) {
            player.setYCoord(this.getGame().getWidth() - player.getSize());
        }

        // this.getConnection().emitMoved();

        // size
        if (loggers.get("sizeUp").getKeyDown()) {
            player.grow(2);
            this.getConnection().emitSizeChanged();
        }
        if (loggers.get("sizeDown").getKeyDown()) {
            player.grow(-2);
            this.getConnection().emitSizeChanged();
        }


        var collisions = this.getGame().getPlayerCollisions();
        // for (var i = 0; i < collisions.length; i++) {
        //     this.getGame().removeStatic(collisions[i].getID())
        // }

        if (loggers.get("stopSending").getKeyDown()) { // temporary
            console.log(8)
            this.getConnection().setSending(false);
            // loggers.delete("stopSending");
        }
    }




}