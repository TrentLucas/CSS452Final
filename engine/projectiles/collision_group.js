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
    /**
     * Creates a new CollisionGroup
     */
    constructor() {
        // Current default filter type
        this.mDefaultFilterType = eCollisionFilters.eNone;
        
        // Current filter type
        this.mFilterType = eCollisionFilters.eNone;

        // Other CollisionGroups of interest
        this.mInterestGroups = [];
    }

    /**
     * Sets the collision filter of the CollisionGroup.
     * @param {eCollisionFilters} type: Filter Type
     */
    setCollisionFilter(type) {
        this.mFilterType = type;
    }

    /**
     * Sets the default filter type of this CollisionGroup. 
     * The default will be the standard filter for all groups that are not included in the interest groups.
     * @param {eCollisionFilters} type: Filter Type
     */
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
        // Checking if object is null or undefined. Acts like default.
        if ((cg === undefined) || (cg === null)) {
            return ((this.mFilterType == eCollisionFilters.eWhitelist) && (this.mDefaultFilterType == eCollisionFilters.eWhitelist)) ||
                ((this.mFilterType != eCollisionFilters.eWhitelist) && (this.mDefaultFilterType != eCollisionFilters.eBlacklist));
        }

        // Checking if object is in the interest groups or not.
        let index = this.mInterestGroups.indexOf(cg)
        if (index > -1) {
            return ((this.mFilterType == eCollisionFilters.eNone) && (this.mDefaultFilterType != eCollisionFilters.eWhitelist)) ||
                ((this.mFilterType != eCollisionFilters.eBlacklist));
        }
        return ((this.mFilterType == eCollisionFilters.eWhitelist) && (this.mDefaultFilterType == eCollisionFilters.eWhitelist)) ||
                ((this.mFilterType != eCollisionFilters.eWhitelist) && (this.mDefaultFilterType != eCollisionFilters.eBlacklist));
    }
}



export default CollisionGroup;
export {eCollisionFilters}