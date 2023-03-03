/*
 * File: collision_group.js
 *
 * defines a group used for collision filterings for projectiles.
 * 
 */
"use strict";

// Filter constants
const eCollisionFilters = Object.freeze({
    eNone: 0,        // Can collide
    eBlacklist: 1,   // Cannot collide with blacklisted groups
    eWhitelist: 2,   // Only can collide with these whitelisted groups
});

class CollisionGroup {
    constructor() {
        // Current default filter type
        this.mDefaultFilterType = None;
        
        // Current filter type
        this.mFilterType = None;

        // Other CollisionGroups of interest
        this.mInterestGroups = [];
    }

    // Sets the filter type of this CollisionGroup
    setCollisionFilter(type) {
        this.mFilterType = type;
    }

    // Sets the default filter type of this CollisionGroup.
    // The default will be the standard filter for all groups that
    // are not included in the interest groups.
    setDefaultCollisionFilter(type) {
        this.mDefaultFilterType = type;
    }

    // Adds a collision group to the internal array.
    addCollisionGroup(cg) {
        this.mInterestGroups.push(cg);
    }

    // Removes the collision group from the internal array.
    removeCollisionGroup(cg) {
        let index = this.mInterestGroups.indexOf(cg);
        if (index > -1) {
            this.mInterestGroups.splice(index, 1);
        }
    }

    // Returns if the given CollisionGroup can be collided with.
    canCollide(cg) {
        // Checking if object is null. Acts like default.
        if ((cg === undefined) || (cg === null)) {
            return ((this.mFilterType == eWhitelist) && (this.mDefaultFilterType == eWhitelist)) ||
                ((this.mFilterType != eWhitelist) && (this.mDefaultFilterType != eBlacklist));
        }

        // Checking if object is in the interest groups or not.
        let index = this.mInterestGroups.indexOf(cg)
        if (index > -1) {
            return ((this.mFilterType == eNone) && (this.mDefaultFilterType != eWhitelist)) ||
                ((this.mFilterType != eBlacklist));
        }
        return ((this.mFilterType == eWhitelist) && (this.mDefaultFilterType == eWhitelist)) ||
                ((this.mFilterType != eWhitelist) && (this.mDefaultFilterType != eBlacklist));
    }
}



export default CollisionGroup;
export {eCollisionFilters}