import Controller from "./Controller.js";
import KeyLogger from "./KeyLogger.js";


export default class DemoController extends Controller {
    // fields


    constructor(game, display) {
        super(game, display);

        this.addKeyLogger("up", new KeyLogger("w"));
        this.addKeyLogger("left", new KeyLogger("a"));
        this.addKeyLogger("down", new KeyLogger("s"));
        this.addKeyLogger("right", new KeyLogger("d"));

        this.addKeyLogger("sizeUp", new KeyLogger("9"));
        this.addKeyLogger("sizeDown", new KeyLogger("0"));
    }



    interpretKeys() {
        const refreshRate = this.getDisplay().getRefreshRate();
        const loggers = this.getKeyLoggers();
        const player = this.getGame().getPlayer();

        // movement
        const speed = player.getSpeed() / refreshRate;
        const unitVectors = {
            horizontal: loggers.get("right").getKeyDown() + (-1 * loggers.get("left").getKeyDown()),
            vertical: loggers.get("down").getKeyDown() + (-1 * loggers.get("up").getKeyDown())
        }
        if (unitVectors.horizontal != 0 || unitVectors.vertical != 0) {
            if (unitVectors.vertical == 0) {
                player.setXCoord(player.getXCoord() + (10 * speed * unitVectors.horizontal));
            } else if (unitVectors.horizontal == 0) {
                player.setYCoord(player.getYCoord() + (10 * speed * unitVectors.vertical));
            } else {
                player.setXCoord(player.getXCoord() + (7 * speed * unitVectors.horizontal));
                player.setYCoord(player.getYCoord() + (7 * speed * unitVectors.vertical));
            }
        }
        // size
        if (loggers.get("sizeUp").getKeyDown()) {
            player.setSize(player.getSize() + 2);
        }
        if (loggers.get("sizeDown").getKeyDown()) {
            player.setSize(player.getSize() - 2);
        }
    }




}