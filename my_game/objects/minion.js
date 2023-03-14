"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Bullet from "../projectiles/bullet.js";

class Minion extends engine.GameObject {
    constructor(spriteTexture, set, bullet, target) {
        super(null);
        this.mSet = set;
        this.kDelta = 0.2;
        this.mRenderComponent = new engine.SpriteAnimateRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(380, -130 + (290 * Math.random()));
        this.mRenderComponent.getXform().setSize(50, 40);
        this.mRenderComponent.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,   // width x height in pixels
            5,          // number of elements in this sequence
            0);         // horizontal padding in between
        this.mRenderComponent.setAnimationType(engine.eAnimationType.eSwing);
        this.mRenderComponent.setAnimationSpeed(15);
        // show each element for mAnimSpeed updates

        this.mHealth = 100;

        this.kBullet = bullet;
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
        this.mRenderComponent.updateAnimation();
        this.mProjectiles.update([this.mTarget]);

        if (this.getXform().getXPos() > 100) {
            this.getXform().incXPosBy(-.58);
        }

        if (this.mShootTick > 30) {
            this.mShootTick = 0;

            // Making the minion shoot
            let newBullet = new Bullet(this.kBullet, this.mProjectiles);
            newBullet.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos())
            newBullet.getXform().setRotationInDegree(180);
            this.mProjectiles.addToSet(newBullet);
        }
        this.mShootTick++;
    }

    getHealth() { return this.mHealth; }
    incHealthBy(value) { this.mHealth += value; }
    getSet() { return this.mSet; }
}

export default Minion;