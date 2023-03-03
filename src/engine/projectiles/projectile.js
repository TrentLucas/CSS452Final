/*
 * File: projectile.js
 *
 * defines a group used for collision filterings for projectiles.
 * 
 */
"use strict";

import GameObject from "../game_objects/game_object.js";
import SpriteAnimateRenderable from "../renderables/sprite_animate_renderable.js";

class Projectile extends GameObject {
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

    // Orientate the entire object to point towards point p
    // will rotate Xform() accordingly
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

    // update
    update() {
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

        this.mLife++; // Updating Life
        // Checking LifeSpan
        if ((this.mLifeTime >= 0) && (this.mLife >= this.mLifeTime)) {
            this.mActive = false;
            if (this.mSet) {
                this.mSet.removeFromSet(this);
            }
            if ((typeof this.mEndEvent === "function") && (this.mCallEndOnExpire)) {
                this.mEndEvent();
            }
        }

        if (this.mRenderComponent instanceof SpriteAnimateRenderable) {
            this.mRenderComponent.updateAnimation();
        }
    }

    // draw
    draw(aCamera) {
        if (this.mActive) { super.draw(aCamera); }
    }

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

    // Rotates the Projectile Towards the given pos from if it were at another pos
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

    // Sets the end event of the Projectile
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
}

export default Projectile;