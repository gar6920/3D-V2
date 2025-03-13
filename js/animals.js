// animals.js - Handle animal model loading and placement

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from './scene.js';
import { CONSTANTS, getRandomInt } from './utils.js';

// Collection of loaded animal models
const animalModels = {};
const animals = [];

// List of available animals with working GLB models
const animalTypes = [
    'dog',
    'elephant',
    'giraffe',
    'lion',
    'cow',
    'penguin',
    'crocodile',
    'frog'
];

/*
IMPORTANT: To use the detailed Blender models, you need to export them to GLB format:
1. Open each .blend file in Blender (models/animals folder)
2. Go to File > Export > glTF 2.0 (.glb/.gltf)
3. Select GLB format
4. Save in the models/animals folder with the same name (e.g., dog.glb)
5. Repeat for each animal model
*/

// Load animal models from the models/animals folder
async function loadAnimalModels() {
    console.log('Loading animal models...');
    const loader = new GLTFLoader();
    
    const loadPromises = animalTypes.map(animalType => {
        return new Promise((resolve, reject) => {
            const modelPath = `models/animals/${animalType}.glb`;
            console.log(`Loading: ${modelPath}`);
            
            loader.load(
                modelPath,
                (gltf) => {
                    animalModels[animalType] = gltf.scene;
                    console.log(`Loaded ${animalType} model`);
                    
                    // Make sure all parts cast shadows
                    gltf.scene.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    
                    // Add a name tag above the animal
                    addNameTag(gltf.scene, animalType);
                    
                    resolve(animalType);
                },
                (xhr) => {
                    console.log(`${animalType} ${(xhr.loaded / xhr.total * 100)}% loaded`);
                },
                (error) => {
                    console.warn(`Failed to load ${animalType} model: ${error.message}`);
                    resolve(null); // Resolve with null to filter out later
                }
            );
        });
    });
    
    try {
        const loadedModels = await Promise.all(loadPromises);
        const successfullyLoaded = loadedModels.filter(model => model !== null);
        console.log(`Successfully loaded models: ${successfullyLoaded.join(', ')}`);
        return successfullyLoaded.length > 0;
    } catch (error) {
        console.error('Error loading animal models:', error);
        return false;
    }
}

// Add a name tag above an animal model
function addNameTag(modelGroup, animalType) {
    const nameTagGeometry = new THREE.PlaneGeometry(1, 0.3);
    const nameTagCanvas = document.createElement('canvas');
    nameTagCanvas.width = 128;
    nameTagCanvas.height = 64;
    const nameTagContext = nameTagCanvas.getContext('2d');
    nameTagContext.fillStyle = 'white';
    nameTagContext.fillRect(0, 0, 128, 64);
    nameTagContext.fillStyle = 'black';
    nameTagContext.font = '24px Arial';
    nameTagContext.textAlign = 'center';
    nameTagContext.textBaseline = 'middle';
    nameTagContext.fillText(animalType, 64, 32);
    
    const nameTagTexture = new THREE.CanvasTexture(nameTagCanvas);
    const nameTagMaterial = new THREE.MeshBasicMaterial({
        map: nameTagTexture,
        transparent: true,
        side: THREE.DoubleSide
    });
    const nameTag = new THREE.Mesh(nameTagGeometry, nameTagMaterial);
    
    // Get the bounding box of the model to position the name tag
    const bbox = new THREE.Box3().setFromObject(modelGroup);
    const height = bbox.max.y - bbox.min.y;
    
    // Position the name tag above the animal
    nameTag.position.y = height + 0.5;
    nameTag.rotation.x = -Math.PI / 4; // Angle it towards the camera
    
    // Add name tag to the model group
    modelGroup.add(nameTag);
}

// Place animals randomly throughout the map
function placeAnimals(count = 20) {
    console.log(`Placing ${count} animals on the map...`);
    
    const availableModels = Object.keys(animalModels);
    if (availableModels.length === 0) {
        console.warn('No animal models loaded, cannot place animals');
        return;
    }
    
    // Clear any existing animals
    removeAllAnimals();
    
    const boundary = CONSTANTS.WORLD_BOUNDARY - 5; // Stay away from the edge
    
    for (let i = 0; i < count; i++) {
        // Select a random animal type from available models
        const animalType = availableModels[Math.floor(Math.random() * availableModels.length)];
        
        // Random position within world boundaries
        const x = getRandomInt(-boundary, boundary);
        const z = getRandomInt(-boundary, boundary);
        
        // Random rotation
        const rotation = Math.random() * Math.PI * 2;
        
        // Random scale factor (0.5 to 1.5)
        const scale = 0.5 + Math.random();
        
        // Add the animal to the scene
        addAnimal(animalType, new THREE.Vector3(x, 0, z), rotation, scale);
    }
    
    console.log(`Placed ${animals.length} animals on the map`);
}

// Add a single animal to the scene
function addAnimal(animalType, position, rotation = 0, scale = 1) {
    if (!animalModels[animalType]) {
        console.warn(`Animal model ${animalType} not loaded`);
        return null;
    }
    
    // Clone the animal model
    const animal = animalModels[animalType].clone();
    
    // Set position and rotation
    animal.position.copy(position);
    animal.rotation.y = rotation;
    animal.scale.set(scale, scale, scale);
    
    // Add animal to the scene and our collection
    scene.add(animal);
    animals.push({
        type: animalType,
        object: animal
    });
    
    return animal;
}

// Remove all animals from the scene
function removeAllAnimals() {
    for (const animal of animals) {
        scene.remove(animal.object);
    }
    animals.length = 0;
}

// Initialize the animals system
async function initAnimals() {
    console.log('Initializing animals system...');
    const success = await loadAnimalModels();
    
    if (success) {
        // Place animals on the map
        placeAnimals();
        return true;
    }
    
    return false;
}

export { initAnimals, placeAnimals, animals }; 