"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import SmallBall from "./smallBall.js";

class Fireball2 extends engine.Projectile {
    constructor(texture, set) {
        super(null, set);

        this.tex = texture;
        this.setFrontRotOffset(-90);
        this.setAcc(.23);
        this.setVelocity(6.5);

        this.setRotationAcc(.5);
        this.setDirection(-90);

        this.setGravity(2);
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
        this.mFireball.setAnimationSpeed(7);
        this.mFireball.getXform().setRotationInDegree(45);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(50, 50);

        this.setLifeTime(60);

        this.setEndEvent(this.lifeEnd, true);
    }

    lifeEnd() {
        let ball1 = new SmallBall(this.tex);
        let ball2 = new SmallBall(this.tex);
        let ball3 = new SmallBall(this.tex);

        ball1.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ball2.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ball3.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());

        ball1.getXform().setRotationInDegree(85);
        ball2.getXform().setRotationInDegree(65);
        ball3.getXform().setRotationInDegree(35);

        this.mSet.addToSet(ball1);
        this.mSet.addToSet(ball2);
        this.mSet.addToSet(ball3);
    }
}

export default Fireball2;