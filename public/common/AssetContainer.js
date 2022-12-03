import Image from './Image.js';

export default class AssetContainer {
    // fields
    #container;
    #assets;

    /**
     * initializes an AssetContainer object
     */
    constructor() {
        this.#container = document.createElement('div');
        this.#container.className = 'assetContainer';
        document.body.appendChild(this.#container);

        this.#assets = new Map();
    }

    // standards getters and setters
    getContainer() {
        return this.#container;
    }

    // real methods
    /**
     * adds an asset to the AssetContainer
     * 
     * @param {String} id - the id that the asset will be identified with
     * @param {String} source - the pathway of the image
     * @param {Number} width - the width of the asset
     * @param {Number} height - the height of the asset
     */
    addAsset(id, source, width, height) {
        this.#assets.set(id, new Image(id, source, this.#container, width, height));
        this.#assets.get(id).setDisplay("none");
    }

    removeAsset() {
        
    }

    /**
     * looks for an asset with a given id
     * 
     * @param {String} id - the id being searched for
     * @returns - the asset with the id given
     */
    getAsset(id) {
        return this.#assets.get(id);
    }

    /**
     * draws the asset on a given canvas
     * 
     * @param {Context} ctx 
     * @param {String} id 
     * @param {Number} xCoord 
     * @param {Number} yCoord 
     * @param {Number} width 
     * @param {Number} height 
     */
    drawAsset(ctx, id, xCoord, yCoord, width, height) {
        this.getAsset(id).drawImageOnCanvas(ctx, xCoord, yCoord, width, height);
    }
}