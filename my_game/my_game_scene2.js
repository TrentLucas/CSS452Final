/*
 * File: MyGame.js 
 *       This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Hero from "./objects/hero.js";
import Bullet from "./projectiles/bullet.js";
import Grenade from "./projectiles/grenade.js";
import MegaRocket from "./projectiles/mega_rocket.js";
import HomingRocket from "./projectiles/homing_rocket.js";
import BlueFireball from "./projectiles/blue_fireball.js";

import MyGame from "./my_game_main.js";
import Minion from "./objects/minion.js";
import Explosion from "./projectiles/explosion.js";
import Brain from "./objects/brain.js";

class SecondScene extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kBoy = "assets/boy.png";
        this.kPlatformTexture = "assets/platform.png";
        this.kWallTexture = "assets/wall.png";
        this.kTargetTexture = "assets/target.png";
        this.kBullet = "assets/bulletTEST.png";
        this.kBackground = "assets/background2.png";
        this.kCrosshair = "assets/crosshair.png";
        this.kFireball = "assets/grenades.png";  // Portal and Collector are embedded here
        this.kFireball2 = "assets/bulletsheet.png";  // Portal and Collector are embedded here
        this.kExplosion = "assets/explosion.png";  // Portal and Collector are embedded here
        this.kBlueFireball = "assets/lastbluefireball.png";  // Portal and Collector are embedded here

        // Background
        this.mBackground = null;

        // The camera to view the scene
        this.mCamera = null;

        // Hero
        this.mHero = null;

        // Sets
        this.mProjectiles = null;
        this.mProjectiles2 = null;
        this.mBadGuySet = null;

        // Option of projectile
        this.mOption = 0;
        this.mOptionName = "Regular Bullet";

        // Fire rate
        this.mFireRate = 10;

        // Tick
        this.mTick = 0;

        // Spawn Tick
        this.mSpawnTick = 3000;

        // Mouse
        this.mMouse = null;
    }


    load() {
        engine.texture.load(this.kBoy);
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kPlatformTexture);
        engine.texture.load(this.kWallTexture);
        engine.texture.load(this.kTargetTexture);
        engine.texture.load(this.kBullet);
        engine.texture.load(this.kBackground);
        engine.texture.load(this.kFireball);
        engine.texture.load(this.kFireball2);
        engine.texture.load(this.kCrosshair);
        engine.texture.load(this.kExplosion);
        engine.texture.load(this.kBlueFireball);
    }

    unload() {
        engine.texture.unload(this.kBoy);
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kPlatformTexture);
        engine.texture.unload(this.kWallTexture);
        engine.texture.unload(this.kTargetTexture);
        engine.texture.unload(this.kBullet);
        engine.texture.unload(this.kBackground);
        engine.texture.unload(this.kFireball);
        engine.texture.unload(this.kFireball2);
        engine.texture.unload(this.kCrosshair);
        engine.texture.unload(this.kExplosion);
        engine.texture.unload(this.kBlueFireball);
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

        // Background
        this.mBackground = new engine.TextureRenderable(this.kBackground);
        this.mBackground.setColor([1, 1, 1, .18]);
        this.mBackground.getXform().setSize(600, 400);
        this.mBackground.getXform().setPosition(50, 40);

        // Hero
        this.mHero = new Hero(this.kBoy);

        // Sets
        this.mProjectiles = new engine.ProjectileSet();
        this.mProjectiles2 = new engine.ProjectileSet();
        this.mBadGuySet = new engine.GameObjectSet();

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
        this.mProjectiles.draw(this.mCamera);
        this.mProjectiles2.draw(this.mCamera);
        this.mMouse.draw(this.mCamera);
        this.mBadGuySet.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mHero.update();
        this.mProjectiles.update([this.mBadGuySet]);
        this.mProjectiles2.update([this.mBadGuySet]);
        this.mBadGuySet.update();

        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            switch (this.mOption) {
                case 0:
                    this.mOptionName = "Grenade with fragments";
                    this.mOption = 1;
                    break;
                case 1:
                    this.mOptionName = "Mega Rocket";
                    this.mOption = 2;
                    break;
                case 2:
                    this.mOptionName = "Homing Rocket";
                    this.mOption = 3;
                    break;
                case 3:
                    this.mOptionName = "Blue fireballs";
                    this.mOption = 4;
                    break;
                default:
                    this.mOptionName = "Regular Bullet";
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
                newProjectile.getXform().setPosition(this.mHero.getXform().getXPos() + 30 , this.mHero.getXform().getYPos() + 1);
            } else if (this.mOption == 1) {
                newProjectile = new Grenade(this.kFireball, this.kExplosion, this.mProjectiles, this.mProjectiles2);
                newProjectile.getXform().setPosition(this.mHero.getXform().getXPos() - 20 , this.mHero.getXform().getYPos() - 5);
            } else if (this.mOption == 2) {
                newProjectile = new MegaRocket(this.kFireball, this.kExplosion, this.mProjectiles, this.mProjectiles2);
                newProjectile.getXform().setPosition(this.mHero.getXform().getXPos() + 28 , this.mHero.getXform().getYPos() + 3);   
            } else if (this.mOption == 3) {
                newProjectile = new HomingRocket(this.kFireball, this.kExplosion, this.mProjectiles, this.mProjectiles2);
                newProjectile.getXform().setPosition(this.mHero.getXform().getXPos() + 23 , this.mHero.getXform().getYPos() + 6);
                newProjectile.setTarget(this.mMouse);
            } else if (this.mOption == 4) {
                newProjectile = new BlueFireball(this.kBlueFireball, this.kExplosion, this.mProjectiles);
                newProjectile.getXform().setPosition(this.mHero.getXform().getXPos() + 23 , this.mHero.getXform().getYPos() + 6);
                newProjectile.setTarget(this.mMouse);

                let newProjectile2 = new BlueFireball(this.kBlueFireball, this.kExplosion, this.mProjectiles);
                newProjectile2.getXform().setPosition(this.mHero.getXform().getXPos() + 23 , this.mHero.getXform().getYPos() + 6);
                newProjectile2.setTarget(this.mMouse);
                this.mProjectiles.addToSet(newProjectile2);
                
                let newProjectile3 = new BlueFireball(this.kBlueFireball, this.kExplosion, this.mProjectiles);
                newProjectile3.getXform().setPosition(this.mHero.getXform().getXPos() + 23 , this.mHero.getXform().getYPos() + 6);
                newProjectile3.setTarget(this.mMouse);
                this.mProjectiles.addToSet(newProjectile3);
                
            }

            // Setting up an end event for destroying the minions
            let set = this.mBadGuySet;
            let set2 = this.mProjectiles2
            let kExplos = this.kExplosion;
            function endEvent(obj) {
                if (newProjectile.lifeEnd) {
                    newProjectile.lifeEnd(endEvent);
                }

                if ((obj instanceof Minion) || (obj instanceof Brain)) {
                    obj.incHealthBy(-20)
                    obj.getXform().incXPosBy(13);
                    if (obj.getHealth() <= 0) {
                        set.removeFromSet(obj);
                        let newExplos = new Explosion(kExplos, 40, set2);
                        obj.getXform().incXPosBy(20);
                        newExplos.getXform().setPosition(obj.getXform().getXPos(), obj.getXform().getYPos());
                        set2.addToSet(newExplos);
                    }
                }
            }

            newProjectile.setEndEvent(endEvent, true);
            newProjectile.rotateTowards(this.mMouse.getXform().getPosition());
            this.mProjectiles.addToSet(newProjectile);
        }

        if (this.mSpawnTick > 150) {
            this.mSpawnTick = 0;
            let newMinion = new Minion(this.kMinionSprite, this.mBadGuySet, this.kBullet, this.mHero);
            let newBrain = new Brain(this.kMinionSprite, this.mBadGuySet, this.kFireball, this.mHero, this.kExplosion)

            this.mBadGuySet.addToSet(newMinion);
            this.mBadGuySet.addToSet(newBrain);
        }

        gUpdateFrame(this.mOptionName);

        this.mTick++;
        this.mSpawnTick++;

        if (engine.input.isKeyClicked(engine.input.keys.N)) {
            this.next();
        }
    }

    next() {      
        super.next();  // this must be called!

        // next scene to run
        let nextLevel = new MyGame();  // next level to be loaded
        nextLevel.start();
    }

}


export default SecondScene;