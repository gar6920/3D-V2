// Scene.js - Handles the Three.js scene, camera, and objects

// Create scene and camera
const scene = new THREE.Scene();
let camera;

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
    
    // Scene will be populated in later steps with:
    // - Lighting
    // - Ground plane
    // - Cubes and other objects
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

// Export the scene, camera, and functions
export { scene, camera, initScene, createCube, cubes }; 