// Collision.js - Handles collision detection between objects

import * as THREE from 'three';
import { camera } from './scene.js';
import { cubes } from './scene.js';

// Check for collisions between camera and objects
function checkCollisions() {
    // Will be implemented in Step 9
    return false;
}

// Check if two axis-aligned bounding boxes (AABB) intersect
function checkAABBCollision(minA, maxA, minB, maxB) {
    return (
        minA.x <= maxB.x && maxA.x >= minB.x &&
        minA.y <= maxB.y && maxA.y >= minB.y &&
        minA.z <= maxB.z && maxA.z >= minB.z
    );
}

// Export collision functions
export { checkCollisions, checkAABBCollision }; 