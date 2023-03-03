"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class SmallBall extends engine.Projectile {
    constructor(texture, set) {
        super(null);

        this.tex = texture;
        this.setFrontRotOffset(-90);
        this.setAcc(6);
        this.setVelocity(6);

        this.setRotationAcc(1);
        this.setDirection(-90);

        this.setGravity(3);
        this.setGravityMax(5);
        this.setGravityConstant(.02);

        this.mFireball = new engine.SpriteAnimateRenderable(texture);
        this.mFireball.setColor([0, 0, 0, 0]);
        this.mFireball.getXform().setPosition(20, 59.5);
        this.mFireball.getXform().setSize(4, 3.2);
        this.mFireball.setSpriteSequence(160, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
            35, 35,       // width x height in pixels
            4,              // number of elements in this sequence
            -3);             // horizontal padding in between
        this.mFireball.setAnimationType(engine.eAnimationType.eRight);
        this.mFireball.setAnimationSpeed(10);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(25, 25);

        this.setLifeTime(55);
    }
}

export default SmallBall;