// Controls.js - Handles player input and camera movement

import * as THREE from 'three';
import { camera, scene, playerGroup, playerModel } from './scene.js';
import { CONSTANTS } from './utils.js';
import { checkCollisions } from './collision.js';

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

// Third-person camera settings
let cameraDistance = 5; // Default distance behind player
let cameraHeight = 3; // Default height above player
let cameraAngle = 0.3; // Default vertical angle for third-person camera (0 = horizontal, positive = looking down)
const MIN_CAMERA_DISTANCE = 2;
const MAX_CAMERA_DISTANCE = 20;
const MIN_CAMERA_ANGLE = -Math.PI / 4; // -45 degrees
const MAX_CAMERA_ANGLE = Math.PI / 3; // 60 degrees

// Mouse sensitivity (lower = less sensitive)
const MOUSE_SENSITIVITY = 0.002;
const CAMERA_ANGLE_SENSITIVITY = 0.005;
const ZOOM_SENSITIVITY = 0.5;

// View mode (first-person or third-person)
let viewMode = 'firstPerson';

// Control state
let isPointerLocked = false;

// Initialize the controls
function initControls() {
    // Keyboard controls
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    
    // Mouse controls
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Mouse wheel for zoom
    window.addEventListener('wheel', onMouseWheel, { passive: false });
    
    // Pointer lock controls
    document.addEventListener('click', requestPointerLock, false);
    document.addEventListener('pointerlockchange', onPointerLockChange, false);
    document.addEventListener('pointerlockerror', onPointerLockError, false);
    
    console.log("Controls initialized with wheel listener");
}

// Clean up event listeners
function cleanupControls() {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('wheel', onMouseWheel);
    document.removeEventListener('click', requestPointerLock);
    document.removeEventListener('pointerlockchange', onPointerLockChange);
    document.removeEventListener('pointerlockerror', onPointerLockError);
}

// Handle mouse wheel for zoom
function onMouseWheel(event) {
    // Prevent default scrolling behavior
    event.preventDefault();
    
    if (!isPointerLocked) return;
    
    // Only process wheel events in third-person mode
    if (viewMode !== 'thirdPerson') return;
    
    // Get scroll direction and adjust camera distance
    const delta = Math.sign(event.deltaY) * ZOOM_SENSITIVITY;
    cameraDistance = Math.max(MIN_CAMERA_DISTANCE, Math.min(MAX_CAMERA_DISTANCE, cameraDistance + delta));
    
    console.log(`Zoom: distance=${cameraDistance.toFixed(2)}`);
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

// Switch between first-person and third-person view
function switchViewMode() {
    if (viewMode === 'firstPerson') {
        // Switch to third-person view
        viewMode = 'thirdPerson';
        
        // Remove camera from player group
        playerGroup.remove(camera);
        scene.add(camera);
        
        // Make player model visible
        playerModel.visible = true;
        
        // Position camera behind and above player
        updateThirdPersonCamera();
        
        console.log("Switched to third-person view");
        
    } else {
        // Switch to first-person view
        viewMode = 'firstPerson';
        
        // Remove camera from scene and add to player group
        scene.remove(camera);
        playerGroup.add(camera);
        
        // Reset camera position to first-person view
        camera.position.set(0, 1.5, 0);
        camera.rotation.order = 'YXZ';
        camera.rotation.x = pitch;
        camera.rotation.y = yaw;
        
        // Hide player model in first-person mode to avoid seeing inside it
        playerModel.visible = false;
        
        console.log("Switched to first-person view");
    }
}

// Update third-person camera position
function updateThirdPersonCamera() {
    // Calculate horizontal position behind player
    const horizontalDirection = new THREE.Vector3(0, 0, 1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    
    // Calculate vertical position based on camera angle
    const verticalOffset = cameraHeight + Math.sin(cameraAngle) * cameraDistance;
    
    // Adjust horizontal position based on camera angle
    const horizontalDistance = cameraDistance * Math.cos(cameraAngle);
    
    // Calculate final camera position
    camera.position.copy(playerGroup.position)
        .add(new THREE.Vector3(0, verticalOffset, 0))
        .sub(horizontalDirection.multiplyScalar(horizontalDistance));
    
    // Make camera look at player (at eye level)
    camera.lookAt(playerGroup.position.clone().add(new THREE.Vector3(0, 1, 0)));
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
        case 'KeyV':
            // Toggle view mode on V key press
            switchViewMode();
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
    
    if (viewMode === 'firstPerson') {
        // Update rotation with sensitivity for first-person view
        yaw -= mouseX * MOUSE_SENSITIVITY;
        pitch -= mouseY * MOUSE_SENSITIVITY;
        
        // Limit pitch to prevent camera flipping (-89 to +89 degrees in radians)
        pitch = Math.max(-Math.PI * 0.49, Math.min(Math.PI * 0.49, pitch));
    } else {
        // In third-person view, horizontal mouse movement rotates around the player
        yaw -= mouseX * MOUSE_SENSITIVITY;
        
        // Vertical mouse movement adjusts camera angle
        cameraAngle -= mouseY * CAMERA_ANGLE_SENSITIVITY;
        
        // Clamp camera angle to reasonable values
        cameraAngle = Math.max(MIN_CAMERA_ANGLE, Math.min(MAX_CAMERA_ANGLE, cameraAngle));
        
        console.log(`Camera angle: ${cameraAngle.toFixed(2)}`);
    }
}

// Update camera position and rotation based on controls
function updateControls() {
    if (viewMode === 'firstPerson') {
        // Update camera rotation in first-person view
        camera.rotation.order = 'YXZ'; // This ensures proper FPS-style rotation
        camera.rotation.x = pitch;
        camera.rotation.y = yaw;
    } else {
        // Update camera position in third-person view
        updateThirdPersonCamera();
        
        // Update player model rotation to face the direction of movement
        playerModel.rotation.y = yaw;
    }

    // Only process movement if pointer is locked
    if (!isPointerLocked) return;

    // Calculate movement direction based on player rotation
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
        
        // Store current position in case we need to revert
        const previousPosition = playerGroup.position.clone();
        
        // Update player group position instead of camera directly
        playerGroup.position.x += moveDirection.x;
        playerGroup.position.z += moveDirection.z;
        
        // Check for collisions (will need to be updated for player model in Feature 1)
        if (checkCollisions()) {
            // If collision occurred, revert to previous position
            playerGroup.position.copy(previousPosition);
        }
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
    isPointerLocked,
    viewMode
}; 