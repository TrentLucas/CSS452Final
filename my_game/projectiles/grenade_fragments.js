"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Explosion from "./explosion.js";
import Minion from "../objects/minion.js";
import Brain from "../objects/brain.js";

class GrenadeFragments extends engine.Projectile {
    constructor(texture, texture2, set) {
        super(null, set);

        this.tex = texture;
        this.tex2 = texture2;
        this.setFrontRotOffset(-130);
        this.setAcc(6);
        this.setVelocity(4);

        this.setRotationAcc(.3);
        this.setDirection(0);

        this.setGravity(.04);
        this.setGravityMax(1);
        this.setGravityConstant(.01);

        this.mFireball = new engine.SpriteAnimateRenderable(texture);
        this.mFireball.setColor([0, 0, 0, 0]);
        this.mFireball.getXform().setPosition(20, 59.5);
        this.mFireball.getXform().setSize(4, 3.2);
        this.mFireball.setSpriteSequence(250, -15,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
        50, 50,       // width x height in pixels
        2,              // number of elements in this sequence
        -8.4);             // horizontal padding in between
        this.mFireball.setAnimationType(engine.eAnimationType.eRight);
        this.mFireball.setAnimationSpeed(15);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(35, 35);

        this.setLifeTime(13);

        this.setEndEvent(this.lifeEnd, true);
    }

    lifeEnd(obj) {
        let ex = new Explosion(this.tex2, 40, this.mSet);

        ex.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());

        this.mSet.addToSet(ex);

        if ((obj instanceof Minion) || (obj instanceof Brain)) {
            obj.incHealthBy(-20)
            obj.getXform().incXPosBy(13);
            if (obj.getHealth() <= 0) {
                obj.getSet().removeFromSet(obj);
            }
        }
    }
}

export default GrenadeFragments;