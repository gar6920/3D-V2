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
- Imports Three.js from CDN
- Loads the main.js module to bootstrap the application

### main.js
- Application entry point
- Initializes the Three.js renderer
- Sets up the game loop using requestAnimationFrame
- Coordinates interactions between other modules
- Handles window resize events
- Manages high-level game state

### scene.js
- Creates and manages the Three.js Scene object
- Sets up the camera with the specified parameters
- Contains functions for creating and managing 3D objects
- Will handle lighting and environment setup in future steps
- Exports scene objects for use in other modules

### controls.js
- Manages all user input (keyboard, mouse)
- Handles pointer lock for smooth camera rotation
- Tracks movement states (forward, backward, left, right)
- Updates camera position and rotation based on input
- Implements limits on camera movement (e.g., pitch constraints)

### collision.js
- Implements collision detection algorithms (AABB)
- Checks for collisions between the player and objects
- Exports collision utility functions
- Will prevent player movement into objects in future steps

### utils.js
- Provides global constants for game parameters
- Contains utility functions used across modules
- Centralizes configuration values for easy tweaking
- Provides helper functions for common operations (e.g., random number generation)

## Data Flow
1. User input is captured in controls.js
2. main.js game loop calls the update functions of other modules
3. controls.js updates movement variables based on input
4. collision.js checks if movement would cause collisions
5. scene.js updates object positions and camera viewpoint
6. main.js renders the updated scene

This architecture allows for clean separation of concerns while maintaining the ability for modules to communicate through well-defined interfaces (exported functions and variables).
