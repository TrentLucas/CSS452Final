"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Minion from "../objects/minion.js";

class Bullet extends engine.Projectile {
    constructor(texture, set) {
        super(null);

        this.setFrontRotOffset(-90);
        this.setAcc(10);
        this.setVelocity(10);

        this.mRenderComponent = new engine.TextureRenderable(texture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(15, 15);

        this.setLifeTime(50);

        this.setEndEvent(this.hitEvent);
    }
}

export default Bullet;