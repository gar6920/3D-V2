// Collision.js - Handles collision detection between objects

import * as THREE from 'three';
import { camera, playerGroup, playerModel } from './scene.js';
import { cubes } from './scene.js';

// Constants for collision detection
const PLAYER_WIDTH = 1.0;   // Player model width/depth is 1.0
const PLAYER_HEIGHT = 1.5;  // Player model height is 1.5

// Check for collisions between player and objects
function checkCollisions(futurePosition = null) {
    // Create player AABB
    const position = futurePosition || playerGroup.position;
    const playerMin = new THREE.Vector3(
        position.x - PLAYER_WIDTH / 2,
        position.y,  // Start from ground level
        position.z - PLAYER_WIDTH / 2
    );
    const playerMax = new THREE.Vector3(
        position.x + PLAYER_WIDTH / 2,
        position.y + PLAYER_HEIGHT,  // Full height
        position.z + PLAYER_WIDTH / 2
    );

    // Check collision with each cube
    for (const cube of cubes) {
        // Get cube dimensions
        const size = cube.geometry.parameters.width;
        
        // Create cube AABB
        const cubeMin = new THREE.Vector3(
            cube.position.x - size / 2,
            cube.position.y,  // Start from base of cube
            cube.position.z - size / 2
        );
        const cubeMax = new THREE.Vector3(
            cube.position.x + size / 2,
            cube.position.y + size,  // Full height of cube
            cube.position.z + size / 2
        );

        // Check for collision
        if (checkAABBCollision(playerMin, playerMax, cubeMin, cubeMax)) {
            return true; // Collision detected
        }
    }
    
    return false; // No collisions
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