// Scene.js - Handles the Three.js scene, camera, and objects

// Import Three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Create scene and camera
const scene = new THREE.Scene();
let camera;

// Lighting
let directionalLight;
let ambientLight;

// Game objects
let ground;
let cubes = [];

// Player objects
let playerGroup;
let playerModel;

// Initialize the scene, camera, and basic objects
async function initScene() {
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    
    // Create player group
    playerGroup = new THREE.Object3D();
    playerGroup.position.set(0, 0, 0);
    scene.add(playerGroup);
    
    // Load player model
    const loader = new GLTFLoader();
    try {
        const gltf = await loader.loadAsync('models/a box test from blender.glb');
        playerModel = gltf.scene;
        playerModel.scale.set(1, 1, 1); // Adjust scale if needed
        playerModel.position.y = 0.75; // Position at half height above ground
        playerModel.name = 'player';
        playerModel.visible = false; // Start invisible in first-person view
        playerModel.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        playerGroup.add(playerModel);
    } catch (error) {
        console.error('Error loading player model:', error);
        // Fallback to basic box if model fails to load
        const playerGeometry = new THREE.BoxGeometry(1, 1.5, 1);
        const playerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            metalness: 0.3,
            roughness: 0.7
        });
        playerModel = new THREE.Mesh(playerGeometry, playerMaterial);
        playerModel.position.y = 0.75; // Position at half height above ground
        playerModel.name = 'player';
        playerModel.visible = false; // Start invisible in first-person view
        playerModel.castShadow = true;
        playerModel.receiveShadow = true;
        playerGroup.add(playerModel);
    }
    
    // Add camera to player group at eye level (top of model)
    camera.position.set(0, 1.5, 0); // Eye height at top of player model (1.5 units)
    camera.rotation.order = 'YXZ'; // Proper order for FPS controls
    playerGroup.add(camera);
    
    // Add lighting
    directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -25;
    directionalLight.shadow.camera.right = 25;
    directionalLight.shadow.camera.top = 25;
    directionalLight.shadow.camera.bottom = -25;
    scene.add(directionalLight);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Create and add ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00,
        roughness: 0.8,
        metalness: 0.2
    });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.position.y = 0; // Position at y=0
    ground.receiveShadow = true;
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
    const material = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.7,
        metalness: 0.3
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.name = 'cube';
    scene.add(cube);
    cubes.push(cube);
    return cube;
}

// Export the scene, camera, lights, and functions
export { scene, camera, directionalLight, ambientLight, playerGroup, playerModel, initScene, createCube, cubes }; 