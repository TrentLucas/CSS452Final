"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import MiniRocket from "./mini_rocket.js";

class Rocket1 extends engine.Projectile {
    constructor(texture, texture2, set, set2) {
        super(null, set);

        this.mSet2 = set2;

        this.tex = texture;
        this.tex2 = texture2;
        this.setFrontRotOffset(-90);
        this.setAcc(.2);
        this.setVelocity(5);

        this.setRotationAcc(.4);
        this.setDirection(-90);

        this.setGravity(.04);
        this.setGravityMax(1);
        this.setGravityConstant(.01);

        this.mFireball = new engine.SpriteAnimateRenderable(texture);
        this.mFireball.setColor([0, 0, 0, 0]);
        this.mFireball.getXform().setPosition(20, 59.5);
        this.mFireball.getXform().setSize(4, 3.2);
        this.mFireball.setSpriteSequence(130, -15,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
        50, 50,       // width x height in pixels
        8,              // number of elements in this sequence
        -8.4);             // horizontal padding in between
        this.mFireball.setAnimationType(engine.eAnimationType.eRight);
        this.mFireball.setAnimationSpeed(8);
        this.mFireball.getXform().setRotationInDegree(40);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(50, 50);

        this.setLifeTime(45);

        this.setEndEvent(this.lifeEnd, true);
    }

    lifeEnd() {
        let ex1 = new MiniRocket(this.tex, this.tex2, this.mSet, this.mSet2);
        let ex2 = new MiniRocket(this.tex, this.tex2, this.mSet, this.mSet2);
        let ex3 = new MiniRocket(this.tex, this.tex2, this.mSet, this.mSet2);

        ex1.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ex2.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ex3.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());

        ex1.getXform().setRotationInDegree(this.getXform().getRotationInDegree() + 10);
        ex2.getXform().setRotationInDegree(this.getXform().getRotationInDegree());
        ex3.getXform().setRotationInDegree(this.getXform().getRotationInDegree() - 10);

        this.mSet.addToSet(ex1);
        this.mSet.addToSet(ex2);
        this.mSet.addToSet(ex3);

    }
}


export default Rocket1;