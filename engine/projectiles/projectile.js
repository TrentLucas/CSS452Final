/*
 * File: projectile.js
 *
 * defines a group used for collision filterings for projectiles.
 * 
 */
"use strict";

import { collideShape } from "../components/physics.js";
import GameObject from "../game_objects/game_object.js";
import SpriteAnimateRenderable from "../renderables/sprite_animate_renderable.js";
import GameObjectSet from "../game_objects/game_object_set.js";

class Projectile extends GameObject {
    /**
     * -- Creates a new Projecitle object.
     * @param {TextureInfo} renderable: texture used to represent the projectile
     * @param {GameObjectSet} set: set the Projectile belongs to
     */
    constructor(renderable, set) {
        super(renderable); // Calling GameObject's constructor

        // The set this Projectile belongs to
        this.mSet = set;

        // Collision Group of the Projectile
        this.mCollisionGroup = null;

        // The direction the front faces for the Projectile
        this.mFrontRotOffset = 0; // rotation offset for the front direction of the renderable

        // Lifetime Info
        this.mLife = 0; // Current lifetime of the Projectile
        this.mLifeTime = -1; // Max lifetime of the Projectile (per update)
        
        // Projectile Physics Info
        this.mAcceleration = 0; // Acceleration of the Projectile (in units per update)
        this.mRotAcceleration = 0; // Rotation Acceleration (rate used for rotateObjPointTo too. 90 for instant.)
        this.mVelocity = 0; // Current velocity of the Projectile
        this.mVelocityGoal = 0; // Velocity Goal of the Projectile
        this.mDirectionGoal = 0; // Direction Goal of the Projectile (rotation in degrees)
        this.mTarget = null // Projectile's target used for tracking
        this.mGravity = 0; // Current gravity affect
        this.mGravityConstant = 0; // How much change gravity will have in ratio to the y rotation of the Projectile
        this.mGravityMax = 0; // The max mGravity can reach
        
        // Active Status of the projectile
        this.mActive = true;

        // End Events
        this.mEndEvent = null;
        this.mCallEndOnExpire = false;
    }

    /**
     * -- Rotates the object to the angle using the given rate.
     * @param {vec2} p 
     * @param {float} rate 
     */
    rotateObjPointToAngle(p, rate) {
        // Step A: determine if reached the destination position p
        let dir = [];
        vec2.sub(dir, p, this.getXform().getPosition());
        let len = vec2.length(dir);
        if (len < Number.MIN_VALUE) {
            return; // we are there.
        }
        vec2.scale(dir, dir, 1 / len);

        // Step B: compute the angle to rotate
        let fdir = this.getCurrentFrontDir();
        let cosTheta = vec2.dot(dir, fdir);

        if (cosTheta > 0.999999) { // almost exactly the same direction
            return;
        }

        // Step C: clamp the cosTheta to -1 to 1 
        // in a perfect world, this would never happen! BUT ...
        if (cosTheta > 1) {
            cosTheta = 1;
        } else {
            if (cosTheta < -1) {
                cosTheta = -1;
            }
        }

        // Step D: compute whether to rotate clockwise, or counterclockwise
        let dir3d = vec3.fromValues(dir[0], dir[1], 0);
        let f3d = vec3.fromValues(fdir[0], fdir[1], 0);
        let r3d = [];
        vec3.cross(r3d, f3d, dir3d);

        let rad = Math.acos(cosTheta);  // radian to roate
        if (r3d[2] < 0) {
            rad = -rad;
        }

        // Step E: rotate the facing direction with the angle and rate
        rad *= (rate * Math.PI / 180.0);  // actual angle need to rotate from Obj's front
        vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
        this.getXform().incRotationByRad(rad);
    }

    /**
     * -- Updates the projectile. Deals with movement, rotation, gravity, lifetime, collisions, etc.
     * @param {array} collisionArray: Contains GameobjectSets and/or GameObjects. Used for collisions.
     * Each object contained in the array will be checked against for collisions.
     */
    update(collisionArray) {
        if (!this.mActive) { return; }

        super.update(); // Calling GameObject's update
        let xform = this.getXform();
        
        // Computing the correct front direction of the Renderable/Projectile
        let unitCirOffset = (Math.PI / 2) + (this.mFrontRotOffset * Math.PI / 180.0);
        let radRotation = xform.getRotationInRad();
        let xFace = Math.cos(radRotation + unitCirOffset);
        let yFace = Math.sin(radRotation + unitCirOffset);
        this.setCurrentFrontDir(vec2.fromValues(xFace, yFace));

        // Gravity
        let gEffect = this.mGravityConstant * Math.abs(yFace);
        let gravity = this.mGravity += gEffect;

        // Updating the Velocitys
        if (this.mVelocity != this.mVelocityGoal) {
            let need = this.mVelocityGoal - this.mVelocity;
            let accel = Math.min(this.mAcceleration, Math.abs(need));
            this.mVelocity += accel * ((need < 0) ? -1 : 1);
        }

        // Updating the Direction; determined if there is a target or not.
        if (this.mTarget) {
            this.rotateObjPointToAngle(this.mTarget.getXform().getPosition(), this.mRotAcceleration);
        } else {
            let currRotation = xform.getRotationInDegree();
            if (currRotation != this.mDirectionGoal && this.mRotAcceleration != 0) {
                let goal = this.mDirectionGoal;
                let realRot = currRotation + ((currRotation < 0) ? 360 : 0);
                let realGoal = goal + ((goal < 0) ? 360 : 0);
                let dir = (realGoal - realRot + 540) % 360 - 180
                let need = (goal - currRotation);
                let accel = Math.min(this.mRotAcceleration, Math.abs(need));
                accel *= ((dir < 0) ? -1 : 1) ;
                xform.incRotationByDegree(accel);
                let frontDir = this.getCurrentFrontDir();
                vec2.rotate(frontDir, frontDir, (Math.PI * accel / 180));
            }
        }

        // Moving the Projectile
        let pos = xform.getPosition();
        vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.mVelocity); // Velocity of Projectile
        vec2.scaleAndAdd(pos, pos, vec2.fromValues(0, 1), gravity * -1); // Gravity

        // Updating Sprite Animation
        if (this.mRenderComponent instanceof SpriteAnimateRenderable) {
            this.mRenderComponent.updateAnimation();
        }

        this.mLife++; // Updating Life

        // Collision Detection
        if (collisionArray) {
            for (let i = 0; i < collisionArray.length; i++) {
                let object = collisionArray[i];
                if (object instanceof GameObject) {
                    this._checkCollision(object);
                } else if (object instanceof GameObjectSet) {
                    let size = object.size();
                    for (let i = 0; i < size; i++) {
                        let realObject = object.getObjectAt(i);
                        this._checkCollision(realObject);
                    }
                }
            }
        }

        // Checking LifeSpan
        if ((this.mLifeTime >= 0) && (this.mLife >= this.mLifeTime)) {
            this._endProjectile();
        }
    }

    /**
     * Draws the projectile if it is active.
     * @param {Camera} aCamera: Camera to draw too.
     */
    draw(aCamera) {
        if (this.mActive) { super.draw(aCamera); }
    }

    // Setters
    setFrontRotOffset(front) { this.mFrontRotOffset = front; } // Sets the front rotation offset for the Projectile
    setLifeTime(lifetime) { this.mLifeTime = lifetime; } // Sets the lifetime of the Projectile
    setTarget(gameObject) { this.mTarget = gameObject; } // Sets the Projectile's target

    setAcc(acceleration) { this.mAcceleration = acceleration; } // Sets the acceleration of the Projectile
    setRotationAcc(acceleration) { this.mRotAcceleration = acceleration; } // Sets the rotation acceleration of the Projectile
    setVelocity(velocity) { this.mVelocityGoal = velocity; } // Sets the velocity goal
    setDirection(direction) { this.mDirectionGoal = direction; } // Sets the direction goal of the Projectile

    setGravity(gravity) { this.mGravity = gravity; } // Sets the gravity of the Projectile.
    setGravityConstant(constant) { this.mGravityConstant = constant; } // Sets the gravity constant of the Projectile.
    setGravityMax(max) { this.mGravityMax = max; } // Sets the max gravity can reach

    // Getters
    getCurrentVelocity() { return this.mVelocity; } // Returns the current velocity.
    getCurrentLife() { return this.mLife; } // Returns the length of time the projectile has existed.
    getCurrentGravity() { return this.mGravity; } // Returns the current gravity value.
    getCurrentDirection() { return this.mDirectionGoal; } // Returns the current direction.

    getSet() { return this.mSet; } // Returns the set this Projectile belongs to.

    isActive() { return this.mActive } // Returns true if active or false if inactive.

    /**
     * -- Rotates the projectile so it faces the given position.
     * @param {vec2} target: Target position.
     */
    rotateTowards(target) {
        this._fixFrontDirection();
        // Step A: determine if reached the destination position p
        let dir = [];
        vec2.sub(dir, target, this.getXform().getPosition());
        let len = vec2.length(dir);
        if (len < Number.MIN_VALUE) {
            return; // we are there.
        }
        vec2.scale(dir, dir, 1 / len);

        // Step B: compute the angle to rotate
        let fdir = this.getCurrentFrontDir();
        let cosTheta = vec2.dot(dir, fdir);
        if (cosTheta > 0.999999) { // almost exactly the same direction
            return;
        }

        // Step C: clamp the cosTheta to -1 to 1 
        // in a perfect world, this would never happen! BUT ...
        if (cosTheta > 1) {
            cosTheta = 1;
        } else {
            if (cosTheta < -1) {
                cosTheta = -1;
            }
        }

        // Step D: compute whether to rotate clockwise, or counterclockwise
        let dir3d = vec3.fromValues(dir[0], dir[1], 0);
        let f3d = vec3.fromValues(fdir[0], fdir[1], 0);
        let r3d = [];
        vec3.cross(r3d, f3d, dir3d);

        let rad = Math.acos(cosTheta);  // radian to roate
        if (r3d[2] < 0) {
            rad = -rad;
        }

        // Step E: rotate the facing direction with the angle and rate
        rad *= 1;  
        vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
        this.getXform().incRotationByRad(rad);
    }

    /**
     * If the projectile gets hit, the given method will be called.
     * @param {function} event: The function to be called on an end event.
     * @param {boolean} callOnExpire: Determines whether event will be called on life expiration.
     */
    setEndEvent(event, callOnExpire) {
        this.mEndEvent = event;
        this.mCallEndOnExpire = callOnExpire;
    }

    // Fixes the front direction of the projectile
    _fixFrontDirection() {
        let unitCirOffset = (Math.PI / 2) + (this.mFrontRotOffset * Math.PI / 180.0);
        let radRotation = this.getXform().getRotationInRad();
        let xFace = Math.cos(radRotation + unitCirOffset);
        let yFace = Math.sin(radRotation + unitCirOffset);
        this.setCurrentFrontDir(vec2.fromValues(xFace, yFace));
    }

    // Checks for a collision with the given oasbject
    _checkCollision(object) {
        // Safety checks
        if (object == this) { return; }
        if (!this.mActive) { return; }

        // For pixel touches collisions
        let tPos = []; // touch position
        // let touch = this.pixelTouches(object, tPos);

        // For bounding-box only collisions
        let touch = this.getBBox().intersectsBound(object.getBBox()) & this.canCollideWithObj(object); 

        if (touch) {
            this._endProjectile(object); 
        }
    }

    // Kills/ends the projectile
    _endProjectile(hitObject) {
        this.mActive = false;
        if (this.mSet) { this.mSet.removeFromSet(this); }
        if ((typeof this.mEndEvent === "function") && (hitObject || this.mCallEndOnExpire)) {
            this.mEndEvent(hitObject);
        }
    }
}

export default Projectile;