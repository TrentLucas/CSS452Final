"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Explosion from "./explosion.js";
import Minion from "../objects/minion.js";
import Brain from "../objects/brain.js";

class MiniRocket extends engine.Projectile {
    constructor(texture, texture2, set, set2) {
        super(null, set);

        this.mSet2 = set2;

        this.tex = texture;
        this.tex2 = texture2;


        // Example of using the API
        this.setFrontRotOffset(-90);
        this.setAcc(3);
        this.setVelocity(5.5);

        this.setRotationAcc(.3);
        this.setDirection(0);

        this.setGravity(.04);
        this.setGravityMax(1);
        this.setGravityConstant(.01);

        this.mFireball = new engine.SpriteAnimateRenderable(texture);
        this.mFireball.setColor([0, 0, 0, 0]);
        this.mFireball.getXform().setPosition(20, 59.5);
        this.mFireball.getXform().setSize(4, 3.2);
        this.mFireball.setSpriteSequence(160, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
            35, 35,       // width x height in pixels
            4,              // number of elements in this sequence
            5);             // horizontal padding in between
        this.mFireball.setAnimationType(engine.eAnimationType.eRight);
        this.mFireball.setAnimationSpeed(15);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(25, 25);

        this.setLifeTime(50);

        this.setEndEvent(this.lifeEnd, true);
    }

    // Example of Life End
    // obj is passed when the lifeEnd is called. It is the object that gets collided with.
    lifeEnd(obj) {
        let ex = new Explosion(this.tex2, 80, this.mSet2);

        ex.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());

        this.mSet2.addToSet(ex);

        if ((obj instanceof Minion) || (obj instanceof Brain)) {
            obj.incHealthBy(-20)
            obj.getXform().incXPosBy(13);
            if (obj.getHealth() <= 0) {
                obj.getSet().removeFromSet(obj);
            }
        }
    }
}

export default MiniRocket;