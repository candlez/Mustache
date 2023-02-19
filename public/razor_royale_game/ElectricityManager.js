import SpawnZone from './../common/SpawnZone.js'
import Electricity from './Electricity.js';

export default class ElectricityManager extends SpawnZone {
    // fields
    #electricity;
    #currentElectricity;
    #maxElectricity;


    constructor(id, game, xCoord, yCoord, bounds, maxElectricity, properties) {
        super(id, game, xCoord, yCoord, bounds, properties)
        this.#electricity = new Array(maxElectricity);
        this.#currentElectricity = 0;
        this.#maxElectricity = maxElectricity;
    }

    // getters and setters
    getElectricity() {
        return this.#electricity;
    }
    getCurrentElectricity() {
        return this.#currentElectricity;
    }
    getMaxElectricity() {
        return this.#maxElectricity;
    }


    // methods
    setMaxElectricity(newMaxElectricity) { // idk if this works lol
        if (newMaxElectricity <= 0) {
            throw new RangeError("maxElectricity must be greater than 0");
        }
        var newElectricity = new Array(newMaxElectricity);
        var count = 0;
        for (var i = 0; i < this.getMaxElectricity(); i++) {
            if (this.#electricity[i] != null) {
                this.#electricity[i].setID(this.generateElectricityID(count));
                newElectricity[count] = this.#electricity[i];
                count++;
            } else {
                continue;
            }
            if (count = newMaxElectricity) {
                break;
            }
        }
        this.#electricity = newElectricity;
        this.#maxElectricity = newMaxElectricity;
    }


    fill() {
        for (var i = 0; i < this.getMaxElectricity(); i++) {
            if (this.getElectricity()[i] == undefined) {
                this.spawnElectricityAtIndex(i);
            }
        }
    }


    spawnElectricityAtIndex(index) {
        var spawn = this.generateSpawnCoords();
        try {
            this.getGame().pointValidation(spawn.x, spawn.y);
        } catch (error) {
            console.log(spawn, error)
            this.spawnElectricityAtIndex(index);
            return;
        }
        this.#electricity[index] = new Electricity(this.generateElectricityID(index), this.getGame(), spawn.x, spawn.y);
        this.getGame().addObject(this.#electricity[index]);
        this.#currentElectricity++;
    }


    spawnElectricity(count) {
        var previous = 0;
        while (count > 0) {
            if (this.getCurrentElectricity() == this.getMaxElectricity()) {
                break;
            }
            for (var i = previous; i < this.getMaxElectricity(); i++) {
                previous++;
                if (this.#electricity[i] == null) {
                    this.spawnElectricityAtIndex(i);
                    break;
                }
            }
            count--; 
        }
    }

    
    removeElectricityAtIndex(index) {
        this.#electricity[index] = null;
        this.#currentElectricity--;
    }


    generateElectricityID(index) {
        return this.getID() + "_" + index;
    }
}