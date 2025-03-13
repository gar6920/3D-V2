// Utils.js - Utility functions and constants for the game

// Constants
const CONSTANTS = {
    // Movement
    MOVEMENT_SPEED: 0.1,
    ROTATION_SPEED: 0.002,
    
    // World
    WORLD_SIZE: 100,
    
    // Object properties
    CUBE_SIZE: 1,
    CAMERA_HEIGHT: 1.5,
    
    // Colors
    GROUND_COLOR: 0x00ff00,  // Green
    
    // Collision
    PLAYER_RADIUS: 0.5
};

// Utility functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    return Math.random() * 0xffffff;
}

// Export utilities
export { CONSTANTS, getRandomInt, getRandomColor }; 