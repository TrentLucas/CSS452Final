"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Explosion extends engine.Projectile {
    constructor(texture, size, set) {
        super(null, set);

        this.tex = texture;

        this.mFireball = new engine.SpriteAnimateRenderable(texture);
        this.mFireball.setColor([0, 0, 0, 0]);
        this.mFireball.getXform().setPosition(20, 59.5);
        this.mFireball.getXform().setSize(4, 3.2);
        this.mFireball.setSpriteSequence(96, 280,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
        100, 100,       // width x height in pixels
        10,              // number of elements in this sequence
        -3);             // horizontal padding in between
        this.mFireball.setAnimationType(engine.eAnimationType.eRight);
        this.mFireball.setAnimationSpeed(5);

        this.mRenderComponent = this.mFireball;
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(-30, 50);
        this.mRenderComponent.getXform().setSize(size, size);

        this.setLifeTime(50);

        // Example of using collision groups so that explosions cannot hit anything
        let collisionGroup = new engine.CollisionGroup();
        collisionGroup.setCollisionFilter(engine.eCollisionFilters.eWhitelist);
        this.setCollisionGroup(collisionGroup);
    }

    lifeEnd() {
        this.mSet.removeFromSet(this);
    }
}

export default Explosion;