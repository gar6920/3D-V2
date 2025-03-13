Feature 1: Adding a Visible Player Character
The goal is to create a visible representation of the player, starting with a basic shape, to enhance immersion. Given the current setup, where the player is represented by the camera, we need to introduce a player object that the camera can follow, visible in the game world.
Step-by-Step Instructions:
Create a Player Group:
In scene.js, create a new THREE.Object3D() named playerGroup to serve as the parent for both the player model and the camera in first-person view.

Add playerGroup to the scene with scene.add(playerGroup).

Add Player Model to Player Group:
Create a basic shape, such as a cube, to represent the player. Use THREE.CubeGeometry(1, 1.5, 1) for a cube with width 1, height 1.5 (to match eye level), and depth 1.

Apply a material, e.g., red color, with new THREE.Material({ color: 0xff0000 }).

Create the mesh with const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial) and add it to playerGroup with playerGroup.add(playerMesh).

Set the name for identification with playerMesh.name = 'player'.

Position the Camera Relative to Player Group:
In controls.js, modify the camera to be a child of playerGroup, positioned at (0, eyeHeight, 0) where eyeHeight is 1.5 (matching the current camera height).

Use camera.position.set(0, eyeHeight, 0) and playerGroup.add(camera).

Update Movement to Affect Player Group:
In controls.js, replace direct modifications to camera.position with updates to playerGroup.position. For example, when moving forward, calculate the direction using camera.getWorldDirection() and add it to playerGroup.position:
javascript

const moveDirection = new THREE.Vec3();
moveDirection.copy(camera.getWorldDirection()).multiplyScalar(moveSpeed);
playerGroup.position.add(moveDirection);

Ensure rotation (mouse movement) updates playerGroup.rotation to maintain consistency.

Update Collision Detection for Player Group:
In collision.js, adjust collision checks to use playerGroup.position and the player model's bounding box. Create a bounding box for the player with new THREE.Box3().setFromObject(playerMesh) and check intersections with cube bounding boxes:
javascript

const playerBoundingBox = new THREE.Box3().setFromObject(playerMesh);
for (const cube of cubes) {
    const cubeBoundingBox = new THREE.Box3().setFromObject(cube);
    if (playerBoundingBox.intersectsBox(cubeBoundingBox)) {
        // Handle collision, e.g., revert movement
    }
}

Tests for Each Step:
After Step 1.1: Run the game and ensure playerGroup is added to the scene, visible in the console with console.log(scene.children).

After Step 1.2: Verify the player model (red cube) is visible in the scene and moves with the camera in first-person view.

After Step 1.3: Confirm the camera's view is correctly positioned relative to the player model, checking if the view height matches eye level.

After Step 1.4: Ensure moving the player changes playerGroup.position and the camera follows, testing with WASD keys.

After Step 1.5: Test collisions by moving toward a cube and verify the player stops at the correct distance, indicating proper collision detection.

Feature 2: Implementing Third-Person View
This feature allows switching to a third-person perspective, where the camera follows behind the player character, visible on screen. This enhances gameplay by providing a broader view of the environment.
Step-by-Step Instructions:
Add View Mode Toggle:
Introduce a variable viewMode in main.js or controls.js, initialized to 'firstPerson': let viewMode = 'firstPerson';.

Function to Switch View Modes:
Create a function to toggle between view modes, adjusting camera parentage and position. For example:
javascript

function switchViewMode() {
    if (viewMode === 'firstPerson') {
        // Switch to thirdPerson
        scene.remove(camera);
        camera.position.copy(playerGroup.position);
        camera.position.sub(playerGroup.getWorldDirection().multiplyScalar(10)); // 10 units behind
        camera.lookAt(playerGroup.position);
        viewMode = 'thirdPerson';
    } else {
        // Switch to firstPerson
        playerGroup.add(camera);
        camera.position.set(0, eyeHeight, 0);
        viewMode = 'firstPerson';
    }
}

Bind this function to a key, e.g., 'F' for first-person and 'T' for third-person, using document.addEventListener('keydown', (event) => { if (event.key === 'F') switchViewMode(); }).

Implement Third-Person Camera Controls:
In controls.js, handle mouse movements to rotate the camera around the player in third-person view. Use angles for rotation:
javascript

let horizontalAngle = 0, verticalAngle = 0, cameraDistance = 10;
if (viewMode === 'thirdPerson') {
    // Update camera position based on mouse movement
    camera.position.x = playerGroup.position.x + Math.sin(horizontalAngle) * cameraDistance;
    camera.position.z = playerGroup.position.z + Math.cos(horizontalAngle) * cameraDistance;
    camera.position.y = playerGroup.position.y + 5; // Fixed height offset
    camera.lookAt(playerGroup.position);
    // Update angles based on mouse movement (example, adjust based on your mouse input)
    horizontalAngle += mouseDeltaX * 0.002;
}

Ensure player movement (WASD) still updates playerGroup.position in both modes.

Tests for Each Step:
After Step 2.1: Ensure viewMode initializes correctly, checking with console.log(viewMode).

After Step 2.2: Toggle the view mode with 'F' or 'T' and check if the camera position and orientation change, ensuring the player model is visible in third-person view.

After Step 2.3: Move the mouse in third-person view and ensure the camera orbits around the player, testing with different angles and distances.

Feature 3: Creating a Minimap
The minimap will provide a top-down view of the game world, showing the player and cubes, enhancing navigation. Given the world is a 100x100 unit flat plane, we'll map x and z coordinates to a 2D canvas.
Step-by-Step Instructions:
Add Minimap Canvas to HTML:
In index.html, add a <canvas> element with id="minimap" and dimensions width="200" height="200": <canvas id="minimap" width="200" height="200"></canvas>.

Set Up Minimap Rendering:
In main.js, get the canvas context and define mapping functions. Set worldSize = 100 and minimapSize = 200, with scale = minimapSize / worldSize = 2.

Define the mapping function:
javascript

function mapToMinimap(x, z) {
    const px = (x + worldSize / 2) * scale;
    const py = minimapSize - (z + worldSize / 2) * scale;
    return { x: px, y: py };
}

Update Minimap in Game Loop:
In the render loop of main.js, clear the minimap and redraw objects:
javascript

function render() {
    // Clear minimap
    ctx.clearRect(0, 0, minimapSize, minimapSize);
    // Draw ground
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, minimapSize, minimapSize);
    // Draw cubes and player
    scene.children.forEach((object) => {
        if (object.name === 'cube' || object.name === 'player') {
            const { x: px, y: py } = mapToMinimap(object.position.x, object.position.z);
            if (object.name === 'player') {
                ctx.fillStyle = 'red';
            } else {
                ctx.fillStyle = 'blue';
            }
            ctx.fillRect(px - 2, py - 2, 4, 4);
        }
    });
    // Continue with standard render loop
}

Ensure scene.children includes objects named 'cube' and 'player', as set in scene.js.

Tests for Each Step:
After Step 3.1: Ensure the canvas is displayed on the page, checking with browser developer tools.

After Step 3.2: Verify that positions are correctly mapped, testing with a few known coordinates (e.g., x=0, z=0 should map to px=100, py=100).

After Step 3.3: Ensure the minimap correctly displays the positions of cubes and the player, moving the player and checking updates on the minimap.

