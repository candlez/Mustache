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

        this.addKeyLogger("shoot", new KeyLogger(" "));
        this.addKeyLogger("testQuadTree", new KeyLogger("q"));
    }



    interpretKeys() { // these ought to be broken up into different methods
        const refreshRate = this.getDisplay().getRefreshRate(); // what is this for?
        const loggers = this.getKeyLoggers();
        const player = this.getGame().getPlayer();

        // movement
        const gameBounds = this.getGame().getBounds(); // ????
        const speed = player.getSpeed();
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
        // console.log(unitVectors);
        const old = player.getVectors();
        player.setVectors(unitVectors);
        if (unitVectors[0] != old[0] || unitVectors[1] != old[1]) {
            console.log("emit vectors changed");
            this.getConnection().emitVectorsChanged([
                unitVectors[0] - old[0],
                unitVectors[1] - old[1]
            ]);
        }

        
        // size
        if (loggers.get("sizeUp").getKeyDown()) {
            // note that this is hard-coded
            this.getGame().changeObjectSize(player, 2);
            this.getConnection().emitSizeChanged(2);
        }
        if (loggers.get("sizeDown").getKeyDown()) {
            this.getGame().changeObjectSize(player, -2);
            this.getConnection().emitSizeChanged(-2);
        }


        var collisions = this.getGame().getPlayerCollisions();
        // for (var i = 0; i < collisions.length; i++) {
        //     this.getGame().removeStatic(collisions[i].getID())
        // }

        // this is very makeshift
        // it will be refined in future
        if (loggers.get("shoot").getKeyDown()) {
            this.getGame().addObjectBasedOnData({
                args: {
                    type: "square",
                    id: player.getID() + ".l." + this.getGame().getGameTime(),
                    x: player.getXCoord(),
                    y: player.getYCoord(),
                    lastVectorChange: 0,
                    vectors: player.getVectors(),
                    args: {
                        size: 50,
                        color: "lime"
                    },
                    dynamic: true
                },
                timeStamp: 0
            })
            console.log("shot!");
        }
    }




}