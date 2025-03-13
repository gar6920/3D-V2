// Scene.js - Handles the Three.js scene, camera, and objects

// Import Three.js
import * as THREE from 'three';

// Create scene and camera
const scene = new THREE.Scene();
let camera;

// Lighting
let directionalLight;
let ambientLight;

// Game objects
let ground;
let cubes = [];

// Initialize the scene, camera, and basic objects
function initScene() {
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.set(0, 1.5, 0); // Set camera at eye level (1.5 units)
    camera.lookAt(0, 1.5, -1); // Look forward
    
    // Add lighting
    directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Create and add ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.position.y = 0; // Position at y=0
    scene.add(ground);
    
    // Add initial cubes to the scene
    // Create a row of cubes at different positions
    createCube(-5, 0.5, -10, 1, 0xff0000); // Red cube
    createCube(0, 0.5, -10, 1, 0x0000ff);  // Blue cube
    createCube(5, 0.5, -10, 1, 0xff00ff);   // Purple cube
    
    // Create some scattered cubes
    createCube(-3, 0.5, -15, 1, 0xffff00);  // Yellow cube
    createCube(3, 0.5, -15, 1, 0x00ffff);   // Cyan cube
    
    // Create a larger cube as an obstacle
    createCube(0, 1, -20, 2, 0x808080);     // Large gray cube
}

// Create a cube with specified parameters
function createCube(x, y, z, size, color) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    scene.add(cube);
    cubes.push(cube);
    return cube;
}

// Export the scene, camera, lights, and functions
export { scene, camera, directionalLight, ambientLight, initScene, createCube, cubes }; 