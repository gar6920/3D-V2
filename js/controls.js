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

// Mouse sensitivity (lower = less sensitive)
const MOUSE_SENSITIVITY = 0.002;

// Control state
let isPointerLocked = false;

// Initialize the controls
function initControls() {
    // Keyboard controls
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    
    // Mouse controls
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Pointer lock controls
    document.addEventListener('click', requestPointerLock, false);
    document.addEventListener('pointerlockchange', onPointerLockChange, false);
    document.addEventListener('pointerlockerror', onPointerLockError, false);
}

// Clean up event listeners
function cleanupControls() {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('click', requestPointerLock);
    document.removeEventListener('pointerlockchange', onPointerLockChange);
    document.removeEventListener('pointerlockerror', onPointerLockError);
}

// Request pointer lock
function requestPointerLock() {
    if (!isPointerLocked) {
        document.body.requestPointerLock();
    }
}

// Handle pointer lock change
function onPointerLockChange() {
    isPointerLocked = document.pointerLockElement === document.body;
    
    // Update UI or game state based on pointer lock
    const instructions = document.getElementById('instructions');
    if (instructions) {
        instructions.style.display = isPointerLocked ? 'none' : 'block';
    }
}

// Handle pointer lock error
function onPointerLockError() {
    console.warn('Pointer lock failed. Your browser may not support this feature.');
    const instructions = document.getElementById('instructions');
    if (instructions) {
        instructions.innerHTML = 'Your browser may not support pointer lock. Please try a different browser.';
    }
}

// Handle keydown events
function onKeyDown(event) {
    if (!isPointerLocked) return;
    
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
        case 'Escape':
            // Allow escape to exit pointer lock
            document.exitPointerLock();
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
    if (!isPointerLocked) return;

    // Get mouse movement
    mouseX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    mouseY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    
    // Update camera rotation with sensitivity
    yaw -= mouseX * MOUSE_SENSITIVITY;
    pitch -= mouseY * MOUSE_SENSITIVITY;
    
    // Limit pitch to prevent camera flipping (-89 to +89 degrees in radians)
    pitch = Math.max(-Math.PI * 0.49, Math.min(Math.PI * 0.49, pitch));
}

// Update camera position and rotation based on controls
function updateControls() {
    // Update camera rotation based on mouse movement
    camera.rotation.order = 'YXZ'; // This ensures proper FPS-style rotation
    camera.rotation.x = pitch;
    camera.rotation.y = yaw;

    // Only process movement if pointer is locked
    if (!isPointerLocked) return;

    // Calculate movement direction based on camera rotation
    const moveDirection = new THREE.Vector3();
    
    if (moveForward) {
        moveDirection.z -= Math.cos(yaw);
        moveDirection.x -= Math.sin(yaw);
    }
    if (moveBackward) {
        moveDirection.z += Math.cos(yaw);
        moveDirection.x += Math.sin(yaw);
    }
    if (moveLeft) {
        moveDirection.z += Math.sin(yaw);
        moveDirection.x -= Math.cos(yaw);
    }
    if (moveRight) {
        moveDirection.z -= Math.sin(yaw);
        moveDirection.x += Math.cos(yaw);
    }

    // Normalize movement vector to ensure consistent speed in all directions
    if (moveDirection.length() > 0) {
        moveDirection.normalize();
        
        // Apply movement speed
        moveDirection.multiplyScalar(CONSTANTS.MOVEMENT_SPEED);
        
        // Update camera position
        camera.position.x += moveDirection.x;
        camera.position.z += moveDirection.z;
    }
}

// Export control functions and variables
export {
    initControls,
    cleanupControls,
    updateControls,
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    pitch,
    yaw,
    isPointerLocked
}; 