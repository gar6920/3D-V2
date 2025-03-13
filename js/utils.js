// Utils.js - Utility functions and constants for the game

// Constants
const CONSTANTS = {
    // Movement
    MOVEMENT_SPEED: 0.1,
    ROTATION_SPEED: 0.002,
    
    // World
    WORLD_SIZE: 100,
    WORLD_BOUNDARY: 50, // Half the WORLD_SIZE - the boundary for wrapping
    
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

// Wrap a position around the world boundary (globe-like wrapping)
function wrapPosition(position) {
    const boundary = CONSTANTS.WORLD_BOUNDARY;
    
    // Create a new vector to avoid modifying the original directly
    const wrapped = position.clone();
    
    // Wrap X coordinate
    if (wrapped.x > boundary) wrapped.x = -boundary + (wrapped.x - boundary);
    else if (wrapped.x < -boundary) wrapped.x = boundary + (wrapped.x + boundary);
    
    // Wrap Z coordinate
    if (wrapped.z > boundary) wrapped.z = -boundary + (wrapped.z - boundary);
    else if (wrapped.z < -boundary) wrapped.z = boundary + (wrapped.z + boundary);
    
    return wrapped;
}

// Export utilities
export { CONSTANTS, getRandomInt, getRandomColor, wrapPosition }; 