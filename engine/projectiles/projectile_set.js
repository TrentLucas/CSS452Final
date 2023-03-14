/*
 * File: projectile_set.js
 *
 * utility class for a collection of Projectiles
 * 
 */
"use strict";

import GameObjectSet from "../game_objects/game_object_set.js";

class ProjectileSet extends GameObjectSet {
    constructor() {
        super();
    }

    // new update
    update(array) {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].update(array);
        }
    }
}

export default ProjectileSet;