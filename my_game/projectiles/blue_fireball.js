"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Explosion from "./explosion.js";

class BlueFireball extends engine.Projectile {
    constructor(texture, texture2, set) {
        super(null, set);

        this.tex = texture;
        this.tex2 = texture2;
        this.setFrontRotOffset(- (Math.random() * 180));
        this.setAcc(100);
        this.setVelocity(3 + (Math.random() * 2));

        this.setRotationAcc(5);

        this.mFireball = new engine.SpriteAnimateRenderable(texture);
        this.mFireball.setColor([1, 1, 1, 0]);
        this.mFireball.getXform().setPosition(15, 62.5);
        this.mFireball.getXform().setSize(4, 3.2);
        this.mFireball.setSpriteSequence(80, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
        85, 85,       // width x height in pixels
        40,              // number of elements in this sequence
        -5);             // horizontal padding in between
        this.mFireball.setAnimationType(engine.eAnimationType.eSwing);
        this.mFireball.setAnimationSpeed(1);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(40, 40);

        this.setLifeTime(77);


    }
}

export default BlueFireball;