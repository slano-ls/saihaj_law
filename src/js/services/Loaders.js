import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

class Loaders {
    constructor(startAnimation) {
        this.BRAIN_MODEL = null;
        this.brainXRayLight = null;
        this.FONT = null;
        this.assets = new Map();
        this.models = ['BrainUVs.obj'];
        this.loadingManager = new THREE.LoadingManager();
        this.startAnimation = startAnimation;
        this.loadingManager.onLoad = this.handlerLoad.bind(this);
        this.loadingManager.onProgress = this.handlerProgress;
        this.loadingManager.onError = this.handlerError;
        this.loadingManager.onStart = this.handlerStart;
        this.setModel = this.setModel.bind(this);
        
        this.loadBrainTextures();
        this.loadOBJs();
        this.loadTextures();
        this.loadFont();
    }

    static handlerStart() {
        console.log('Starting');
    }

    static handlerProgress(url, itemsLoaded, itemsTotal) {
        console.log(`Loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`);
    }

    handlerLoad() {
        console.log('Loading Complete!');
        if (this.startAnimation) {
            this.startAnimation();
        }
    }

    static handlerError(url) {
        console.log(`There was an error loading ${url}`);
    }

    setModel(model, i) {
        switch (i) {
            case 0:
                this.BRAIN_MODEL = model;
                break;
            default:
                this.BRAIN_MODEL = model;
        }
    }

    loadOBJs() {
        const loader = new OBJLoader(this.loadingManager);
        this.models.forEach((m, i) => {
            loader.load(`/static/models/${m}`, (model) => {
                this.setModel(model, i);
            });
        });
    }

    loadTextures() {
        const loader = new THREE.TextureLoader(this.loadingManager);
        loader.load('/static/textures/spark1.png', (t) => {
            this.spark = t;
        });
    }

    loadBrainTextures() {
        const loader = new THREE.TextureLoader(this.loadingManager);
        loader.load('/static/textures/brainXRayLight.png', (t) => {
            this.brainXRayLight = t;
        });
    }

    loadFont() {
        const fontLoader = new FontLoader(this.loadingManager);
        fontLoader.load('/static/fonts/Roboto_Regular.json', (font) => {
            this.FONT = font;
        });
    }

    async loadBrainModel() {
        if (this.BRAIN_MODEL) {
            return this.BRAIN_MODEL;
        }
        
        // Wait for the model to load
        return new Promise((resolve) => {
            this.loadingManager.onLoad = () => {
                resolve(this.BRAIN_MODEL);
            };
        });
    }

    loadTexture(path) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                path,
                (texture) => resolve(texture),
                undefined,
                (error) => reject(error)
            );
        });
    }
}

export default Loaders; 