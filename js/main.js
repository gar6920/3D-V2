// Import Three.js
import * as THREE from 'three';

// Import modules
import { initScene, scene, camera } from './scene.js';
import { initControls, updateControls } from './controls.js';
import { checkCollisions } from './collision.js';
import { CONSTANTS } from './utils.js';

// Renderer
let renderer;

// Game state
let isGameRunning = false;

// Initialize the game
async function init() {
    // Initialize Three.js renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('game-canvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); // Sky blue color
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    try {
        // Initialize scene, camera, controls
        await initScene();
        initControls();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
        
        // Start the game loop
        isGameRunning = true;
        animate();
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Main game loop
function animate() {
    if (!isGameRunning) return;
    
    requestAnimationFrame(animate);
    
    // Update controls
    updateControls();
    
    // Check for collisions
    checkCollisions();
    
    // Render the scene
    renderer.render(scene, camera);
}

// Initialize the game when the page loads
window.addEventListener('load', init);

// Export functions and variables that might be needed elsewhere
export { renderer, isGameRunning }; 