"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Fireball1 extends engine.Projectile {
    constructor(texture, set) {
        super(null);

        this.setFrontRotOffset(-90);
        this.setAcc(5.5);
        this.setVelocity(5.5);

        this.setRotationAcc(1);
        this.setDirection(-90);

        this.setGravity(.04);
        this.setGravityMax(1);
        this.setGravityConstant(.01);

        this.mFireball = new engine.SpriteAnimateRenderable(texture);
        this.mFireball.setColor([0, 0, 0, 0]);
        this.mFireball.getXform().setPosition(20, 59.5);
        this.mFireball.getXform().setSize(4, 3.2);
        this.mFireball.setSpriteSequence(257, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
            65, 65,       // width x height in pixels
            8,              // number of elements in this sequence
            -1);             // horizontal padding in between
        this.mFireball.setAnimationType(engine.eAnimationType.eRight);
        this.mFireball.setAnimationSpeed(5);
        this.mFireball.getXform().setRotationInDegree(70);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(50, 50);

        this.setLifeTime(100);
    }
}

export default Fireball1;