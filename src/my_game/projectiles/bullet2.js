"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Bullet2 extends engine.Projectile {
    constructor(texture, set) {
        super(null, set);

        this.tex = texture;
        this.setFrontRotOffset(-90);
        this.setAcc(.1);
        this.setVelocity(5);

        this.setRotationAcc(5);


        this.mRenderComponent = new engine.TextureRenderable(texture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(25, 25);

        this.setLifeTime(200);
    }
}

export default Bullet2;