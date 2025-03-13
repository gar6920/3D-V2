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
└── models/              # Directory for 3D models
    └── a box test from blender.glb  # Test model for the player character
```

## Module Responsibilities

### index.html
- Provides the HTML structure for the application
- Contains the canvas element where the 3D scene is rendered
- Includes UI elements like instruction text
- Uses ES6 import maps to properly import Three.js as a module
- Loads the main.js module to bootstrap the application
- Provides user instructions for controls, including view toggle and third-person camera controls

### main.js
- Application entry point
- Imports Three.js and other modules
- Initializes the Three.js WebGLRenderer with anti-aliasing
- Sets up the renderer for high-quality shadows:
  - Enables shadowMap
  - Uses PCFSoftShadowMap for smoother shadow edges
- Sets canvas size to match the window dimensions
- Sets up async initialization and error handling:
  - Handles async model loading
  - Provides error handling for failed initialization
- Sets up the game loop using requestAnimationFrame
- Coordinates interactions between other modules
- Handles window resize events (maintaining proper aspect ratio)
- Manages high-level game state
- Sets the renderer's clear color to sky blue (0x87CEEB)

### scene.js
- Imports Three.js properly as an ES6 module
- Imports GLTFLoader from Three.js addons for loading 3D models
- Creates and manages the Three.js Scene object
- Sets up the camera with the specified parameters (FOV: 75, near: 0.1, far: 1000)
- Creates and manages player representation:
  - Creates playerGroup as a parent object for both player model and camera
  - Loads custom GLB model for the player character
  - Includes fallback to basic box model if loading fails
  - Sets player model position to sit properly on the ground (y=0.75)
  - Initially sets model to invisible for first-person view
  - Handles material properties (metalness, roughness) for realistic appearance
  - Parents the camera to playerGroup for first-person view
- Contains functions for creating and managing 3D objects
- Implements lighting system:
  - Directional light (sunlight simulation) at position (5, 10, 7)
  - Ambient light for even scene illumination
  - Both lights use white color (0xffffff)
  - Directional light intensity: 1.0
  - Ambient light intensity: 0.2
  - Configures shadows for directional light with high-quality settings
  - Sets shadow camera parameters for optimal shadow coverage
- Implements ground plane:
  - Uses PlaneGeometry (100x100 units)
  - MeshStandardMaterial with green color (0x00ff00)
  - Positioned at y=0 and rotated -90° on X-axis
  - Configured to receive shadows
  - Provides base for object placement and player movement
- Implements cube creation and management:
  - createCube function for generating parametric cubes
  - Parameters include position (x, y, z), size, and color
  - Uses BoxGeometry and MeshStandardMaterial
  - Configures cubes to cast and receive shadows
  - Maintains array of all created cubes for collision detection
  - Initial scene setup includes:
    - Row of three 1x1 colored cubes at z=-10
    - Two scattered 1x1 cubes at z=-15
    - One larger 2x2 gray obstacle cube at z=-20
- Exports scene objects, camera, lights, playerGroup, playerModel, and cube management functions

### controls.js
- Imports Three.js and required modules
- Manages all user input (keyboard, mouse, mouse wheel)
- Implements view mode management:
  - Tracks current view mode (firstPerson or thirdPerson)
  - Provides toggle functionality with 'V' key
  - Manages camera parenting and positioning based on view mode
  - Handles player model visibility (hidden in first-person view)
- Implements third-person camera controls:
  - Zoom functionality using mouse wheel
  - Camera angle adjustment with mouse movement
  - Configurable limits for minimum/maximum camera distance and angles
  - Smooth transitions between different camera positions
- Implements robust pointer lock system:
  - Handles pointer lock requests and state changes
  - Provides error handling for unsupported browsers
  - Shows/hides UI based on pointer lock state
  - Implements ESC key to exit pointer lock
- Tracks movement states (forward, backward, left, right)
- Implements advanced mouse look controls:
  - Configurable mouse sensitivity via MOUSE_SENSITIVITY constant
  - Cross-browser support for mouse movement events
  - Proper cleanup of event listeners
  - Smooth camera rotation with proper limits
- Updates camera rotation:
  - Uses 'YXZ' rotation order for proper FPS camera behavior
  - Implements yaw (left/right) rotation
  - Implements pitch (up/down) with -89° to +89° limits
  - Inverts Y-axis in third-person view for more intuitive control
  - Prevents camera flipping at extreme angles
- Handles movement:
  - Only processes movement when pointer is locked
  - Calculates movement direction based on player rotation
  - Normalizes movement vector for consistent speed
  - Applies MOVEMENT_SPEED constant for smooth motion
  - Checks for collisions before applying movement
  - Only moves if no collision would occur at the future position
  - Updates playerGroup position rather than camera directly
  - Movement is relative to player facing direction
  - WASD keys move in the corresponding view-relative directions

### collision.js
- Imports Three.js and required modules (camera, playerGroup, and cubes from scene.js)
- Implements AABB (Axis-Aligned Bounding Box) collision detection system:
  - Defines player collision box dimensions to match the model (width: 1.0, height: 1.5)
  - Creates player AABB based on playerGroup position
  - Creates cube AABBs based on their positions and sizes
  - Implements checkAABBCollision utility function for box intersection tests
- Provides collision prediction capability:
  - Can check collisions at a future position before moving
  - Supports passing a potential future position for testing
  - Prevents movement into colliding positions
- Makes collision boxes precise:
  - Player box starts from ground level (y=0) and extends to full height
  - Cube boxes start from their base and extend to full height
  - Uses exact dimensions without margins for precise collision boundaries
- Exports checkCollisions function that:
  - Creates player AABB from current or future playerGroup position
  - Checks for collisions with each cube in the scene
  - Returns true if any collision is detected
  - Returns false if no collisions are found
- Integrates with controls.js to prevent player movement into objects:
  - Collision is checked BEFORE movement
  - Movement is only applied if no collision would occur
  - This prevents any possible overlap between player and objects

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
- Three.js addons (like GLTFLoader) are properly imported through the import map
- The application structure supports async module loading for 3D models

### 3D Model Loading
- GLB models are loaded using GLTFLoader from the Three.js addons
- Async/await pattern handles model loading with proper error handling
- Fallback mechanisms provide simple geometry if model loading fails
- Model traversal ensures properties are applied to all mesh children
- Models are properly positioned, scaled, and integrated with the scene

### Shadow Implementation
- PCFSoftShadowMap provides higher quality shadows
- Directional light shadow parameters are configured for optimal quality
- Shadow maps have sufficient resolution (2048x2048) for detailed shadows
- Shadow camera parameters define the shadow frustum for good coverage
- All objects are properly configured to cast and/or receive shadows

### Collision Detection System
- Uses precise Axis-Aligned Bounding Boxes (AABBs)
- Collision checks happen before movement to prevent any overlap
- Box dimensions match visual objects for realistic collisions
- The system supports checking collisions at potential future positions
- Collisions are resolved by preventing movement rather than reverting

### Camera Management
- The camera has two modes with seamless switching:
  - First-person view: Camera parented to playerGroup, positioned at eye level
  - Third-person view: Camera positioned behind and above player with configurable distance and angle
- The camera's parent changes based on view mode:
  - In first-person mode: Camera is a child of playerGroup
  - In third-person mode: Camera is a direct child of the scene
- Player movement affects the camera differently based on mode:
  - In first-person: Camera moves directly with playerGroup
  - In third-person: Camera follows playerGroup at specified distance and angle

### Rendering Pipeline
1. The WebGLRenderer is created with anti-aliasing for smoother edges
2. Canvas is sized to match the window dimensions (responsive design)
3. Window resize handler updates camera aspect ratio and renderer size
4. The game loop continuously renders the scene at the browser's refresh rate
5. The scene is rendered with the sky blue background color

### User Input System
1. Keyboard events (keydown/keyup) track WASD key states and view toggle
2. Mouse movement events capture pointer movement when locked
3. Mouse wheel events adjust camera distance in third-person view
4. Pointer lock is requested on canvas click
5. Input state is maintained in module-scoped variables
6. Camera rotation and angle adjustments use accumulated mouse movement

### Development Environment
- Uses ES6 modules which require a proper web server (not file://)
- A local development server (http-server) is used to avoid CORS issues
- Responsive design ensures proper display across different screen sizes

## Data Flow
1. User input is captured in controls.js
2. main.js game loop calls the update functions of other modules
3. controls.js updates movement variables and view mode based on input
4. collision.js checks if movement would cause collisions using the playerGroup position
5. scene.js manages the player model and its visibility based on view mode
6. main.js renders the updated scene

This architecture allows for clean separation of concerns while maintaining the ability for modules to communicate through well-defined interfaces (exported functions and variables).

## Implementation Notes for Developers

### Three.js Integration
- Always import Three.js at the top of each module that uses it: `import * as THREE from 'three'`
- The scene, camera, and renderer are created once and shared across modules
- Object creation is centralized in scene.js with helper functions
- The player is represented by a group (playerGroup) containing both the model and camera

### View Mode Management
- View mode toggle is handled by the 'V' key
- When switching to third-person view:
  - Remove camera from playerGroup and add to scene
  - Make player model visible
  - Position camera behind and above player
- When switching to first-person view:
  - Remove camera from scene and add to playerGroup
  - Position camera at eye level (1.5 units high)
  - Hide player model to avoid seeing inside it

### Local Development
- Always use a local development server (like http-server) to serve the files
- This prevents CORS issues with ES6 modules
- Run with `http-server -p 8080 .` to specify port and serve from current directory

### Browser Compatibility
- The application requires browsers with support for ES6 modules and WebGL
- Modern browsers (Chrome, Firefox, Safari, Edge) should work without issues
- Pointer lock API support is required for proper camera controls
