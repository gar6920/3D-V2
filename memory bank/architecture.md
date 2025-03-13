# 3D Exploration Game Architecture

## Overview
This document outlines the architecture of our 3D exploration game built with Three.js. The application follows a modular design with clear separation of concerns, using ES6 modules for organization.

## File Structure
```
project-root/
├── index.html           # Entry point HTML file with canvas element
├── css/
│   └── styles.css       # CSS styling for UI elements
├── js/
│   ├── main.js          # Main application entry point and game loop
│   ├── scene.js         # Three.js scene, camera, and object setup
│   ├── controls.js      # Player input and movement controls
│   ├── collision.js     # Collision detection system
│   └── utils.js         # Constants and utility functions
└── assets/              # Directory for future assets (textures, models, etc.)
```

## Module Responsibilities

### index.html
- Provides the HTML structure for the application
- Contains the canvas element where the 3D scene is rendered
- Includes UI elements like instruction text
- Uses ES6 import maps to properly import Three.js as a module
- Loads the main.js module to bootstrap the application

### main.js
- Application entry point
- Imports Three.js and other modules
- Initializes the Three.js WebGLRenderer with anti-aliasing
- Sets canvas size to match the window dimensions
- Sets up the game loop using requestAnimationFrame
- Coordinates interactions between other modules
- Handles window resize events (maintaining proper aspect ratio)
- Manages high-level game state
- Sets the renderer's clear color to sky blue (0x87CEEB)

### scene.js
- Imports Three.js properly as an ES6 module
- Creates and manages the Three.js Scene object
- Sets up the camera with the specified parameters (FOV: 75, near: 0.1, far: 1000)
- Positions the camera at eye level (1.5 units high)
- Contains functions for creating and managing 3D objects
- Implements lighting system:
  - Directional light (sunlight simulation) at position (5, 10, 7)
  - Ambient light for even scene illumination
  - Both lights use white color (0xffffff)
  - Directional light intensity: 1.0
  - Ambient light intensity: 0.2
- Exports scene objects, camera, and lights for use in other modules

### controls.js
- Imports Three.js and required modules
- Manages all user input (keyboard, mouse)
- Handles pointer lock for smooth camera rotation
- Tracks movement states (forward, backward, left, right)
- Captures mouse movement for camera rotation
- Implements yaw (left/right) and pitch (up/down) rotation
- Limits pitch to prevent camera flipping (±89 degrees)
- Updates camera position and rotation based on input

### collision.js
- Imports Three.js and required modules
- Implements collision detection algorithms (AABB)
- Includes utility function for checking AABB collisions
- Checks for collisions between the player and objects
- Exports collision utility functions
- Will prevent player movement into objects in future steps

### utils.js
- Provides global constants for game parameters:
  - Movement and rotation speeds
  - World size
  - Object properties
  - Colors
  - Collision parameters
- Contains utility functions used across modules
- Centralizes configuration values for easy tweaking
- Provides helper functions for common operations (e.g., random number generation)

## Technical Details

### ES6 Module Integration
- The application uses proper ES6 modules with import/export statements
- Three.js is imported via ES6 import map in index.html, making it available as a module
- Each module explicitly imports its dependencies
- Avoids global variables by using module-scoped variables and explicit exports
- Promotes clean code organization and maintainability

### Rendering Pipeline
1. The WebGLRenderer is created with anti-aliasing for smoother edges
2. Canvas is sized to match the window dimensions (responsive design)
3. Window resize handler updates camera aspect ratio and renderer size
4. The game loop continuously renders the scene at the browser's refresh rate
5. The scene is rendered with the sky blue background color

### User Input System
1. Keyboard events (keydown/keyup) track WASD key states
2. Mouse movement events capture pointer movement when locked
3. Pointer lock is requested on canvas click
4. Input state is maintained in module-scoped variables
5. Camera rotation uses accumulated mouse movement

### Development Environment
- Uses ES6 modules which require a proper web server (not file://)
- A local development server (http-server) is used to avoid CORS issues
- Responsive design ensures proper display across different screen sizes

## Data Flow
1. User input is captured in controls.js
2. main.js game loop calls the update functions of other modules
3. controls.js updates movement variables based on input
4. collision.js checks if movement would cause collisions
5. scene.js updates object positions and camera viewpoint
6. main.js renders the updated scene

This architecture allows for clean separation of concerns while maintaining the ability for modules to communicate through well-defined interfaces (exported functions and variables).

## Implementation Notes for Developers

### Three.js Integration
- Always import Three.js at the top of each module that uses it: `import * as THREE from 'three'`
- The scene, camera, and renderer are created once and shared across modules
- Object creation is centralized in scene.js with helper functions

### Local Development
- Always use a local development server (like http-server) to serve the files
- This prevents CORS issues with ES6 modules
- Run with `http-server -c-1 -o` to disable caching and auto-open the browser

### Browser Compatibility
- The application requires browsers with support for ES6 modules and WebGL
- Modern browsers (Chrome, Firefox, Safari, Edge) should work without issues
