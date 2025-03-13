// Collision.js - Handles collision detection between objects

import * as THREE from 'three';
import { camera, playerGroup, playerModel } from './scene.js';
import { cubes } from './scene.js';
import { CONSTANTS, wrapPosition } from './utils.js';

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

        // Check for collision with the actual cube position
        if (checkAABBCollision(playerMin, playerMax, cubeMin, cubeMax)) {
            return true; // Collision detected
        }

        // For cubes near the boundaries, we need to check for collisions with their "wrapped" positions
        const boundary = CONSTANTS.WORLD_BOUNDARY;
        
        // Only check wrapped collisions for cubes near the boundaries
        if (Math.abs(cube.position.x) > boundary - size * 2 || 
            Math.abs(cube.position.z) > boundary - size * 2) {
            
            // Create a temporary position that's wrapped to the other side
            const wrappedCubePos = new THREE.Vector3();
            
            // Check for X-axis wrapping
            if (cube.position.x > boundary - size) {
                // Cube is at the right edge, check collision with its wrapped position on the left
                wrappedCubePos.set(cube.position.x - CONSTANTS.WORLD_SIZE, cube.position.y, cube.position.z);
                if (checkWrappedCollision(playerMin, playerMax, wrappedCubePos, size)) return true;
            } else if (cube.position.x < -boundary + size) {
                // Cube is at the left edge, check collision with its wrapped position on the right
                wrappedCubePos.set(cube.position.x + CONSTANTS.WORLD_SIZE, cube.position.y, cube.position.z);
                if (checkWrappedCollision(playerMin, playerMax, wrappedCubePos, size)) return true;
            }
            
            // Check for Z-axis wrapping
            if (cube.position.z > boundary - size) {
                // Cube is at the far edge, check collision with its wrapped position on the near edge
                wrappedCubePos.set(cube.position.x, cube.position.y, cube.position.z - CONSTANTS.WORLD_SIZE);
                if (checkWrappedCollision(playerMin, playerMax, wrappedCubePos, size)) return true;
            } else if (cube.position.z < -boundary + size) {
                // Cube is at the near edge, check collision with its wrapped position on the far edge
                wrappedCubePos.set(cube.position.x, cube.position.y, cube.position.z + CONSTANTS.WORLD_SIZE);
                if (checkWrappedCollision(playerMin, playerMax, wrappedCubePos, size)) return true;
            }
            
            // Check for corner cases (diagonal wrapping)
            if (Math.abs(cube.position.x) > boundary - size * 2 && Math.abs(cube.position.z) > boundary - size * 2) {
                // Cube is at a corner, check collision with diagonal wrapped position
                wrappedCubePos.set(
                    cube.position.x > 0 ? cube.position.x - CONSTANTS.WORLD_SIZE : cube.position.x + CONSTANTS.WORLD_SIZE,
                    cube.position.y,
                    cube.position.z > 0 ? cube.position.z - CONSTANTS.WORLD_SIZE : cube.position.z + CONSTANTS.WORLD_SIZE
                );
                if (checkWrappedCollision(playerMin, playerMax, wrappedCubePos, size)) return true;
            }
        }
    }
    
    return false; // No collisions
}

// Helper function to check collision with a wrapped position of a cube
function checkWrappedCollision(playerMin, playerMax, cubeCenterPos, cubeSize) {
    const wrappedCubeMin = new THREE.Vector3(
        cubeCenterPos.x - cubeSize / 2,
        cubeCenterPos.y,
        cubeCenterPos.z - cubeSize / 2
    );
    
    const wrappedCubeMax = new THREE.Vector3(
        cubeCenterPos.x + cubeSize / 2,
        cubeCenterPos.y + cubeSize,
        cubeCenterPos.z + cubeSize / 2
    );
    
    return checkAABBCollision(playerMin, playerMax, wrappedCubeMin, wrappedCubeMax);
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