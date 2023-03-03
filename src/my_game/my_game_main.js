/*
 * File: MyGame.js 
 *       This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Hero from "./objects/hero.js";
import Bullet from "./projectiles/bullet.js";
import Fireball1 from "./projectiles/fireball1.js";
import Fireball2 from "./projectiles/fireball2.js";
import Bullet2 from "./projectiles/bullet2.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kPlatformTexture = "assets/platform.png";
        this.kWallTexture = "assets/wall.png";
        this.kTargetTexture = "assets/target.png";
        this.kBullet = "assets/bulletTEST.png";
        this.kBackground = "assets/background.png";
        this.kCrosshair = "assets/crosshair.png";
        this.kFireball = "assets/fireball_0.png";  // Portal and Collector are embedded here
        this.kFireball2 = "assets/bulletsheet.png";  // Portal and Collector are embedded here

        // Background
        this.mBackground = null;

        // The camera to view the scene
        this.mCamera = null;

        // Hero
        this.mHero = null;

        // Sets
        this.mProjectiles = null;

        // Sets
        this.mTargets = null;

        // Option of projectile
        this.mOption = 0;

        // Fire rate
        this.mFireRate = 10;

        // Tick
        this.mTick = 0;

        // Mouse
        this.mMouse = null;
    }



    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kPlatformTexture);
        engine.texture.load(this.kWallTexture);
        engine.texture.load(this.kTargetTexture);
        engine.texture.load(this.kBullet);
        engine.texture.load(this.kBackground);
        engine.texture.load(this.kFireball);
        engine.texture.load(this.kFireball2);
        engine.texture.load(this.kCrosshair);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kPlatformTexture);
        engine.texture.unload(this.kWallTexture);
        engine.texture.unload(this.kTargetTexture);
        engine.texture.unload(this.kBullet);
        engine.texture.unload(this.kBackground);
        engine.texture.unload(this.kFireball);
        engine.texture.unload(this.kFireball2);
        engine.texture.unload(this.kCrosshair);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 40), // position of the camera
            600,                       // width of camera
            [0, 0, 1200, 800]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]); // sets the background to gray
        // sets the background to gray
        engine.defaultResources.setGlobalAmbientIntensity(3);

        this.mPlatforms = new engine.GameObjectSet();

        this.createBounds();  // added to mPlatforms

        // Background
        this.mBackground = new engine.TextureRenderable(this.kBackground);
        this.mBackground.setColor([1, 1, 1, .3]);
        this.mBackground.getXform().setSize(600, 400);
        this.mBackground.getXform().setPosition(50, 40);

        // Hero
        this.mHero = new Hero(this.kMinionSprite);

        // Sets
        this.mProjectiles = new engine.GameObjectSet();
        this.mTargets = new engine.GameObjectSet();

        // Targets
        let targetRend1 = new engine.TextureRenderable(this.kTargetTexture);
        targetRend1.getXform().setSize(30, 30);
        let targetRend2 = new engine.TextureRenderable(this.kTargetTexture);
        targetRend2.getXform().setSize(30, 30);
        let targetRend3 = new engine.TextureRenderable(this.kTargetTexture);
        targetRend3.getXform().setSize(30, 30);

        let target1 = new engine.GameObject(targetRend1);
        target1.getXform().setPosition(170, 150);

        let target2 = new engine.GameObject(targetRend2);
        target2.getXform().setPosition(100, -70);

        let target3 = new engine.GameObject(targetRend3);
        target3.getXform().setPosition(150, 40);

        this.mTargets.addToSet(target1);
        this.mTargets.addToSet(target2);
        this.mTargets.addToSet(target3);

        // Mouse
        let mouseTexture = new engine.TextureRenderable(this.kCrosshair);
        mouseTexture.getXform().setSize(20, 20);
        this.mMouse = new engine.GameObject(mouseTexture);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
        this.mCamera.setViewAndCameraMatrix();
        this.mBackground.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mTargets.draw(this.mCamera);
        this.mProjectiles.draw(this.mCamera);
        this.mMouse.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mHero.update();
        this.mProjectiles.update();
        this.mTargets.update();

        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            switch (this.mOption) {
                case 0:
                    this.mOption = 1;
                    break;
                case 1:
                    this.mOption = 2;
                    break;
                case 2:
                    this.mOption = 3;
                    break;
                default:
                    this.mOption = 0;
                    break;
            }
        }

        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            switch (this.mFireRate) {
                case 10:
                    this.mFireRate = 5;
                    break;
                case 5:
                    this.mFireRate = 0;
                    break;
                default:
                    this.mFireRate = 10;
                    break;
            }
        }

        let mouseX = this.mCamera.mouseWCX();
        let mouseY = this.mCamera.mouseWCY();

        this.mMouse.getXform().setPosition(mouseX, mouseY);

        // Projectiles
        if (engine.input.isKeyPressed(engine.input.keys.Space) && (this.mTick >= this.mFireRate)) {
            this.mTick = 0;
            let newProjectile

            if (this.mOption == 0) {
                newProjectile = new Bullet(this.kBullet, this.mProjectiles);
            } else if (this.mOption == 1) {
                newProjectile = new Fireball1(this.kFireball, this.mProjectiles);
            } else if (this.mOption == 2) {
                newProjectile = new Fireball2(this.kFireball2, this.mProjectiles);
            } else if (this.mOption == 3) {
                newProjectile = new Bullet2(this.kBullet, this.mProjectiles);
                newProjectile.setTarget(this.mMouse);
            }

            newProjectile.getXform().setPosition(this.mHero.getXform().getXPos() + 5, this.mHero.getXform().getYPos());
            newProjectile.rotateTowards(this.mMouse.getXform().getPosition());
            this.mProjectiles.addToSet(newProjectile);
        }

        this.mTick++;
    }

}


export default MyGame;