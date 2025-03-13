// Collision.js - Handles collision detection between objects

import * as THREE from 'three';
import { camera } from './scene.js';
import { cubes } from './scene.js';

// Constants for collision detection
const PLAYER_WIDTH = 0.5;  // Player collision box width/depth
const PLAYER_HEIGHT = 1.8; // Player collision box height

// Check for collisions between camera and objects
function checkCollisions() {
    // Create player AABB
    const playerMin = new THREE.Vector3(
        camera.position.x - PLAYER_WIDTH / 2,
        camera.position.y - PLAYER_HEIGHT / 2,
        camera.position.z - PLAYER_WIDTH / 2
    );
    const playerMax = new THREE.Vector3(
        camera.position.x + PLAYER_WIDTH / 2,
        camera.position.y + PLAYER_HEIGHT / 2,
        camera.position.z + PLAYER_WIDTH / 2
    );

    // Check collision with each cube
    for (const cube of cubes) {
        // Get cube dimensions
        const size = cube.geometry.parameters.width;
        
        // Create cube AABB
        const cubeMin = new THREE.Vector3(
            cube.position.x - size / 2,
            cube.position.y - size / 2,
            cube.position.z - size / 2
        );
        const cubeMax = new THREE.Vector3(
            cube.position.x + size / 2,
            cube.position.y + size / 2,
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