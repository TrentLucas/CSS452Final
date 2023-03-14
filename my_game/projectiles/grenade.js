"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Explosion from "./explosion.js";
import GrenadeFragments from "./grenade_fragments.js";
import SmallBall from "./mini_rocket.js";

class Grenade extends engine.Projectile {
    constructor(texture, texture2, set, set2) {
        super(null, set);

        this.mSet2 = set2;

        this.tex = texture;
        this.tex2 = texture2;
        this.setFrontRotOffset(-90);
        this.setAcc(2);
        this.setVelocity(4);

        this.setRotationAcc(1);
        this.setDirection(-90);

        this.setGravity(.04);
        this.setGravityMax(1);
        this.setGravityConstant(.01);

        this.mFireball = new engine.SpriteAnimateRenderable(texture);
        this.mFireball.setColor([0, 0, 0, 0]);
        this.mFireball.getXform().setPosition(20, 59.5);
        this.mFireball.getXform().setSize(4, 3.2);
        this.mFireball.setSpriteSequence(87, 110,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
        50, 50,       // width x height in pixels
        4,              // number of elements in this sequence
        -8);             // horizontal padding in between
        this.mFireball.setAnimationType(engine.eAnimationType.eRight);
        this.mFireball.setAnimationSpeed(5);
        this.mFireball.getXform().setRotationInDegree(70);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(50, 50);

        this.setLifeTime(90);

        this.setEndEvent(this.lifeEnd, true);
    }

    lifeEnd() {
        let ex1 = new GrenadeFragments(this.tex, this.tex2, this.mSet);
        let ex2 = new GrenadeFragments(this.tex, this.tex2, this.mSet);
        let ex3 = new GrenadeFragments(this.tex, this.tex2, this.mSet);
        let ex4 = new GrenadeFragments(this.tex, this.tex2, this.mSet);
        let ex5 = new GrenadeFragments(this.tex, this.tex2, this.mSet);
        let ex6 = new GrenadeFragments(this.tex, this.tex2, this.mSet);
        let ex7 = new GrenadeFragments(this.tex, this.tex2, this.mSet);
        let ex8 = new GrenadeFragments(this.tex, this.tex2, this.mSet);

        ex1.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ex2.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ex3.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ex4.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ex5.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ex6.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ex7.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());
        ex8.getXform().setPosition(this.getXform().getXPos(), this.getXform().getYPos());


        ex1.getXform().setRotationInDegree(0);
        ex2.getXform().setRotationInDegree(45);
        ex3.getXform().setRotationInDegree(90);
        ex4.getXform().setRotationInDegree(135);
        ex5.getXform().setRotationInDegree(180);
        ex6.getXform().setRotationInDegree(225);
        ex7.getXform().setRotationInDegree(270);
        ex8.getXform().setRotationInDegree(315);


        this.mSet.addToSet(ex1);
        this.mSet.addToSet(ex2);
        this.mSet.addToSet(ex3);
        this.mSet.addToSet(ex4);
        this.mSet.addToSet(ex5);
        this.mSet.addToSet(ex6);
        this.mSet.addToSet(ex7);
        this.mSet.addToSet(ex8);

    }
}


export default Grenade;