import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/webxr/ARButton.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Initialize renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x4a995a );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.xr.enabled = true; // Enable XR
document.body.appendChild(renderer.domElement);

// Create scene
const scene = new THREE.Scene();

// Initialize camera
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(5, 10, 10);
scene.add(camera);

// Add text geometry above the plant
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
  // Array of lines
  const lines = ['This Plant is known as', 'Tulsi.Also known as' ,'Azadirachta indica.'];

  // Parameters for text geometry
  const textSize = 0.4;
  const textHeight = 0.1;
  const lineHeight = 0.5 ; // Adjust line height between text lines

  // Loop through each line and create a mesh
  lines.forEach((line, index) => {
    const textGeometry = new TextGeometry(line, {
      font: font,
      size: textSize,
      height: textHeight,
      curveSegments: 12,
      bevelEnabled: false
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xdae64e   });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Position each line; adjust Y position by `lineHeight` to prevent overlap
    textMesh.position.set(2, 1 - (index * lineHeight), 2);  // Y position decreases for each line

    scene.add(textMesh);
  });
});


// const fontLoader = new FontLoader();
// fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
//   const textGeometry = new TextGeometry('This Plant is known As Tulsi', {
//     font: font,
//     size: 0.4,
//     height: 0.1,
//     //width:0.2,
//     curveSegments: 12,
//     bevelEnabled: false
//   });
 
//   const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//   const textMesh = new THREE.Mesh(textGeometry, textMaterial);

//   textMesh.position.set(2, 0, 2);  // Position above the plant
//   scene.add(textMesh);
// });

// Show plant info when the AR session starts
const plantInfoDiv = document.getElementById('plant-info');  // Make sure this element exists in HTML
renderer.xr.addEventListener('sessionstart', () => {
  if (plantInfoDiv) {
    plantInfoDiv.style.display = 'block';
  }
});

// Hide plant info when the AR session ends
renderer.xr.addEventListener('sessionend', () => {
  if (plantInfoDiv) {
    plantInfoDiv.style.display = 'none';
  }
});

// Set up OrbitControls for 3D mode (non-AR mode)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Create ground mesh
const groundGeometry = new THREE.PlaneGeometry(20, 20, 30, 30);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x46664e , side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// Add light to the scene
// const spotLight = new THREE.SpotLight(0xffffff, 9500, 100, 0.22, 1);
// spotLight.position.set(5, 40, 40);
// spotLight.castShadow = true;
// spotLight.shadow.bias = 0.00;
// scene.add(spotLight);
// Add multiple spotlights for 360-degree effect
const spotLight1 = new THREE.SpotLight(0xffffff, 18, 10000, Math.PI / 6, 0.5, 1);
spotLight1.position.set(15, 10, 0);
spotLight1.castShadow = true;
scene.add(spotLight1);

const spotLight2 = new THREE.SpotLight(0xffffff, 18, 10000, Math.PI / 6, 0.5, 1);
spotLight2.position.set(-15, 10, 0);
spotLight2.castShadow = true;
scene.add(spotLight2);

const spotLight3 = new THREE.SpotLight(0xffffff, 18, 10000, Math.PI / 6, 0.5, 1);
spotLight3.position.set(0, 10, 15);
spotLight3.castShadow = true;
scene.add(spotLight3);

const spotLight4 = new THREE.SpotLight(0xffffff, 18, 10000, Math.PI / 6, 0.5, 1);
spotLight4.position.set(0, 10, -15);
spotLight4.castShadow = true;
scene.add(spotLight4);

const spotLight5 = new THREE.SpotLight(0xffffff, 18, 10000, Math.PI / 6, 0.5, 1);
spotLight5.position.set(0, 20, 1);
spotLight5.castShadow = false;
scene.add(spotLight5);

// Optionally add spotlight helpers to visualize lights
// const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1);
// scene.add(spotLightHelper1);

// const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
// scene.add(spotLightHelper2);

// const spotLightHelper3 = new THREE.SpotLightHelper(spotLight3);
// scene.add(spotLightHelper3);

// const spotLightHelper4 = new THREE.SpotLightHelper(spotLight4);
// scene.add(spotLightHelper4);

// const spotLightHelper5 = new THREE.SpotLightHelper(spotLight5);
// scene.add(spotLightHelper5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.50); // Lower intensity for soft fill light
scene.add(ambientLight);


// Load 3D model (e.g., a plant)
const loader = new GLTFLoader();
loader.load('./bel1.glb', (gltf) => {
  const model = gltf.scene;
  model.name = 'plantModel';  // Correctly name the model

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  model.position.set(0, 0.001, -0.1);
  scene.add(model);

  const progressContainer = document.getElementById('progress-container');  // Make sure this element exists in HTML
  if (progressContainer) {
    progressContainer.style.display = 'none';
  }
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

// ARButton for entering AR mode
document.body.appendChild(ARButton.createButton(renderer));

// Variables for hit testing
let hitTestSource = null;
let hitTestSourceRequested = false;
let reticle;  // Reticle to visualize where the model will be placed

// Setup reticle for placing objects in AR
const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
reticle.visible = false;
scene.add(reticle);

// Handle session for AR hit testing
renderer.xr.addEventListener('sessionstart', () => {
  const session = renderer.xr.getSession();
  session.addEventListener('select', onSelect);

  if (!hitTestSourceRequested) {
    session.requestReferenceSpace('viewer').then((referenceSpace) => {
      session.requestHitTestSource({ space: referenceSpace }).then((source) => {
        hitTestSource = source;
      });
    });
    hitTestSourceRequested = true;
  }
});

// Function to handle model placement on "select" event
// function onSelect() {
//   if (reticle.visible) {
//     // Clone or move the 3D model to the reticle's position
//     const plantModel = scene.getObjectByName('plantModel');
//     if (plantModel) {
//       const modelClone = plantModel.clone();
//       modelClone.position.setFromMatrixPosition(reticle.matrix);
//       scene.add(modelClone);
//       const plantInfo = "This is a medicinal plant used for...";
//       alert(plantInfo);  // Use a modal or a custom UI instead of alert
//     }
//   }
// }
// Function to handle model placement on "select" event
function onSelect() {
  if (reticle.visible) {
    // Get the 3D plant model
    const plantModel = scene.getObjectByName('plantModel');
    
    if (plantModel) {
      // Clone the model
      const modelClone = plantModel.clone();
      
      // Place the cloned model at the reticle's position
      modelClone.position.setFromMatrixPosition(reticle.matrix);
      
      // Adjust the Y-position to make sure the model is placed at ground level
      // This ensures the model is not floating above the ground
      modelClone.position.y = 0;  // Set the Y-coordinate to ground level
      
      // Adjust the scale of the model to fit the real-world size (if needed)
      modelClone.scale.set(0.5, 0.5, 0.5);  // Example: scaling down by half

      // Add the cloned model to the scene
      scene.add(modelClone);
      
      // Provide additional plant information
      const plantInfo = "This is a medicinal plant used for various purposes...";
      alert(plantInfo);  // Replace this with a more sophisticated UI if needed
    }
  }
}



// Handle resizing of the window
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate function to render the scene and update hit testing for AR
function animate() {
  renderer.setAnimationLoop((timestamp, frame) => {
    if (frame && hitTestSource) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const hitPose = hit.getPose(referenceSpace);

        reticle.visible = true;
        reticle.matrix.fromArray(hitPose.transform.matrix);
      } else {
        reticle.visible = false;
      }
    }

    controls.update();  // Still need controls for non-AR
    renderer.render(scene, camera);
  });
}

animate();
