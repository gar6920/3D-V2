// Controls.js - Handles player input and camera movement

import * as THREE from 'three';
import { camera } from './scene.js';
import { CONSTANTS } from './utils.js';

// Movement flags
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Mouse movement
let mouseX = 0;
let mouseY = 0;
let pitch = 0;
let yaw = 0;

// Initialize the controls
function initControls() {
    // Keyboard controls
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    
    // Mouse controls
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Lock the pointer on click
    document.addEventListener('click', () => {
        document.body.requestPointerLock();
    });
}

// Handle keydown events
function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = true;
            break;
        case 'KeyS':
            moveBackward = true;
            break;
        case 'KeyA':
            moveLeft = true;
            break;
        case 'KeyD':
            moveRight = true;
            break;
    }
}

// Handle keyup events
function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;
        case 'KeyA':
            moveLeft = false;
            break;
        case 'KeyD':
            moveRight = false;
            break;
    }
}

// Handle mouse movement
function onMouseMove(event) {
    if (document.pointerLockElement === document.body) {
        // Get mouse movement
        mouseX = event.movementX || 0;
        mouseY = event.movementY || 0;
        
        // Update camera rotation
        yaw -= mouseX * 0.002;
        pitch -= mouseY * 0.002;
        
        // Limit pitch to avoid camera flipping
        pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch));
    }
}

// Update camera position and rotation based on controls
function updateControls() {
    // Will be implemented in Step 7
}

// Export control functions and variables
export {
    initControls,
    updateControls,
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    pitch,
    yaw
}; 