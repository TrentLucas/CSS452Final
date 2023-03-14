"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import HomingRocket from "../projectiles/homing_rocket.js";
import Explosion from "../projectiles/explosion.js";

class Brain extends engine.GameObject {
    constructor(spriteTexture, set, rocket, target, explos) {
        super(null);
        this.mSet = set;
        this.kDelta = 0.2;

        this.mRenderComponent =  new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(380, -130 + (290 * Math.random()));
        this.mRenderComponent.getXform().setSize(20, 30);
        this.mRenderComponent.setElementPixelPositions(600, 700, 0, 180);
        // show each element for mAnimSpeed updates

        this.mHealth = 20;

        this.kRocket = rocket;
        this.kExplosion = explos;
        this.mShootTick = 0;
        this.mProjectiles = new engine.ProjectileSet();
        this.mTarget = target;
    }

    draw(Camera) {
        super.draw(Camera);
        this.mProjectiles.draw(Camera);
    }

    update() {
        // remember to update this.mRenderComponent's animation
        this.mProjectiles.update([this.mTarget]);

        if (this.getXform().getXPos() > 50) {
            this.getXform().incXPosBy(-.58);
        }

        if (this.mShootTick > 35) {
            this.mShootTick = 0;

            // Homing Rocket
            let newRocket = new HomingRocket(this.kRocket, this.kExplosion, this.mProjectiles, this.mProjectiles);
            newRocket.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos())
            newRocket.getXform().setRotationInDegree(180);
            newRocket.setTarget(this.mTarget);
            this.mProjectiles.addToSet(newRocket);
        }
        this.mShootTick++;
    }

    getHealth() { return this.mHealth; }
    incHealthBy(value) { this.mHealth += value; }
    getSet() { return this.mSet; }
}

export default Brain;