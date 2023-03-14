"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Explosion from "./explosion.js";

class HomingRocket extends engine.Projectile {
    constructor(texture, texture2, set, set2) {
        super(null, set);

        this.mSet2 = set2;

        this.tex = texture;
        this.tex2 = texture2;
        this.setFrontRotOffset(-90);
        this.setAcc(.1);
        this.setVelocity(5);

        this.setRotationAcc(5);

        this.mFireball = new engine.SpriteAnimateRenderable(texture);
        this.mFireball.setColor([0, 0, 0, 0]);
        this.mFireball.getXform().setPosition(20, 59.5);
        this.mFireball.getXform().setSize(4, 3.2);
        this.mFireball.setSpriteSequence(175, -20,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
        50, 50,       // width x height in pixels
        2,              // number of elements in this sequence
        -8);             // horizontal padding in between
        this.mFireball.setAnimationType(engine.eAnimationType.eRight);
        this.mFireball.setAnimationSpeed(5);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(50, 50);

        this.setLifeTime(100);

        this.setEndEvent(this.lifeEnd, true);

    }

    lifeEnd() {
        let ex = new Explosion(this.tex2, 50, this.mSet2);

        ex.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());

        this.mSet2.addToSet(ex);

    }
}

export default HomingRocket;