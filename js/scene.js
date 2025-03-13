// Scene.js - Handles the Three.js scene, camera, and objects

// Import Three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CONSTANTS } from './utils.js';

// Create scene and camera
const scene = new THREE.Scene();
let camera;

// Lighting
let directionalLight;
let ambientLight;

// Game objects
let ground;
let cubes = [];
let boundaryMarkers = []; // Array to store boundary markers
let mirrorObjects = []; // Array to store visual duplicates of objects near boundaries

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
    
    // Add fog to create the illusion of infinite distance
    scene.fog = new THREE.Fog(0x87CEEB, 50, 300);
    
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
    
    // Create and add ground plane - make it much larger to appear infinite
    const groundSize = 1000; // Much larger than our world boundary
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
    
    // Create a texture-like pattern using a more detailed material
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228822, // Slightly darker green
        roughness: 0.8,
        metalness: 0.2
    });
    
    // Add grid pattern to ground for better distance perception
    const gridHelper = new THREE.GridHelper(CONSTANTS.WORLD_SIZE * 2, 100, 0x000000, 0x444444);
    gridHelper.position.y = 0.01; // Slightly above ground to prevent z-fighting
    gridHelper.material.opacity = 0.15;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.position.y = 0; // Position at y=0
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add boundary markers to show the wrapping points
    createBoundaryMarkers();
    
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
    
    // Add additional cubes near boundaries for better edge visualization
    createCube(45, 0.5, 20, 1, 0xff5555);  // Near right boundary
    createCube(-45, 0.5, 20, 1, 0x55ff55); // Near left boundary
    createCube(20, 0.5, 45, 1, 0x5555ff);  // Near far boundary
    createCube(20, 0.5, -45, 1, 0xffff55); // Near near boundary
    
    // Create visual duplicates for objects near boundaries
    createMirrorObjects();
}

// Create visual duplicates of objects that are near boundaries
function createMirrorObjects() {
    // Clear any existing mirror objects
    for (const obj of mirrorObjects) {
        scene.remove(obj);
    }
    mirrorObjects = [];
    
    const boundary = CONSTANTS.WORLD_BOUNDARY;
    const tolerance = 10; // Distance from boundary to create mirror objects
    
    // Check each cube to see if it's near a boundary
    for (const cube of cubes) {
        const size = cube.geometry.parameters.width;
        const isNearXBoundary = Math.abs(Math.abs(cube.position.x) - boundary) < tolerance;
        const isNearZBoundary = Math.abs(Math.abs(cube.position.z) - boundary) < tolerance;
        
        if (isNearXBoundary || isNearZBoundary) {
            // Create mirror duplicates based on position
            let mirrorPositions = [];
            
            // X-axis mirroring
            if (isNearXBoundary) {
                const mirrorX = cube.position.x > 0 
                    ? cube.position.x - CONSTANTS.WORLD_SIZE 
                    : cube.position.x + CONSTANTS.WORLD_SIZE;
                    
                mirrorPositions.push(new THREE.Vector3(
                    mirrorX,
                    cube.position.y,
                    cube.position.z
                ));
            }
            
            // Z-axis mirroring
            if (isNearZBoundary) {
                const mirrorZ = cube.position.z > 0 
                    ? cube.position.z - CONSTANTS.WORLD_SIZE 
                    : cube.position.z + CONSTANTS.WORLD_SIZE;
                    
                mirrorPositions.push(new THREE.Vector3(
                    cube.position.x,
                    cube.position.y,
                    mirrorZ
                ));
            }
            
            // Diagonal mirroring (corner case)
            if (isNearXBoundary && isNearZBoundary) {
                const mirrorX = cube.position.x > 0 
                    ? cube.position.x - CONSTANTS.WORLD_SIZE 
                    : cube.position.x + CONSTANTS.WORLD_SIZE;
                const mirrorZ = cube.position.z > 0 
                    ? cube.position.z - CONSTANTS.WORLD_SIZE 
                    : cube.position.z + CONSTANTS.WORLD_SIZE;
                    
                mirrorPositions.push(new THREE.Vector3(
                    mirrorX,
                    cube.position.y,
                    mirrorZ
                ));
            }
            
            // Create mirror objects at calculated positions
            for (const pos of mirrorPositions) {
                createMirrorCube(cube, pos);
            }
        }
    }
}

// Create a visual duplicate of a cube at the specified position
function createMirrorCube(originalCube, position) {
    // Clone the geometry
    const geometry = originalCube.geometry.clone();
    
    // Clone the material (with slight transparency to blend with distance fog)
    const material = originalCube.material.clone();
    material.transparent = true;
    material.opacity = 0.9; // Less transparent to blend better with the scene
    
    // Create the mirror cube
    const mirrorCube = new THREE.Mesh(geometry, material);
    mirrorCube.position.copy(position);
    mirrorCube.scale.copy(originalCube.scale);
    mirrorCube.rotation.copy(originalCube.rotation);
    mirrorCube.castShadow = true;
    mirrorCube.receiveShadow = true;
    mirrorCube.name = 'mirrorCube';
    scene.add(mirrorCube);
    mirrorObjects.push(mirrorCube);
    
    return mirrorCube;
}

// Update mirror objects positions when player moves
function updateMirrorObjects() {
    // Check if any cubes have moved
    const boundary = CONSTANTS.WORLD_BOUNDARY;
    const tolerance = 10; // Distance from boundary to create mirror objects
    
    // Check if player is near a boundary to recreate mirrors for better visual effect
    const playerPos = playerGroup.position;
    if (Math.abs(Math.abs(playerPos.x) - boundary) < tolerance || 
        Math.abs(Math.abs(playerPos.z) - boundary) < tolerance) {
        createMirrorObjects();
    }
}

// Create boundary markers to visualize the world edges
function createBoundaryMarkers() {
    const boundary = CONSTANTS.WORLD_BOUNDARY;
    const markerHeight = 2; // Reduced height
    const markerSpacing = 15; // Increased spacing
    const markerSize = 0.3; // Reduced size
    const markerColor = 0x228822; // Match ground color for subtlety
    
    // Create corner markers (larger to be more noticeable but still subtle)
    const cornerSize = 0.6;
    const cornerHeight = 3;
    
    // North-East corner
    createBoundaryMarker(boundary, cornerHeight, boundary, cornerSize, 0xff0000);
    // North-West corner
    createBoundaryMarker(-boundary, cornerHeight, boundary, cornerSize, 0x00ff00);
    // South-West corner
    createBoundaryMarker(-boundary, cornerHeight, -boundary, cornerSize, 0x0000ff);
    // South-East corner
    createBoundaryMarker(boundary, cornerHeight, -boundary, cornerSize, 0xffff00);
    
    // Create markers along the X axis (North and South edges)
    for (let x = -boundary + markerSpacing; x < boundary; x += markerSpacing) {
        // North edge
        createBoundaryMarker(x, markerHeight, boundary, markerSize, markerColor);
        // South edge
        createBoundaryMarker(x, markerHeight, -boundary, markerSize, markerColor);
    }
    
    // Create markers along the Z axis (East and West edges)
    for (let z = -boundary + markerSpacing; z < boundary; z += markerSpacing) {
        // East edge
        createBoundaryMarker(boundary, markerHeight, z, markerSize, markerColor);
        // West edge
        createBoundaryMarker(-boundary, markerHeight, z, markerSize, markerColor);
    }
}

// Create a boundary marker at the specified position
function createBoundaryMarker(x, y, z, size, color) {
    const geometry = new THREE.BoxGeometry(size, size * 4, size);
    const material = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.7,
        metalness: 0.3,
        emissive: color,
        emissiveIntensity: 0.2, // Reduced glow
        transparent: true,
        opacity: 0.7 // Make it slightly transparent
    });
    const marker = new THREE.Mesh(geometry, material);
    marker.position.set(x, y, z);
    marker.castShadow = true;
    marker.receiveShadow = true;
    marker.name = 'boundaryMarker';
    scene.add(marker);
    boundaryMarkers.push(marker);
    return marker;
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
export { 
    scene, 
    camera, 
    directionalLight, 
    ambientLight, 
    playerGroup, 
    playerModel, 
    initScene, 
    createCube, 
    cubes, 
    boundaryMarkers,
    mirrorObjects,
    updateMirrorObjects 
}; 