import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Scene and camera setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(4, 5, 11);
camera.lookAt(0, 0, 0);

// Add a ground plane
const groundGeometry = new THREE.PlaneGeometry(20, 20);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

// Add a spotlight
const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5);
spotLight.position.set(0, 25, 0);
scene.add(spotLight);

// (Optional) Axes helper to visualize orientation
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Variable to store the loaded GLTF model
let rotatingMesh = null;

// Load the asset and apply the correct rotation
const loader = new GLTFLoader().setPath('public/');
loader.load(
  'MyAsset.glb',
  (gltf) => {
    rotatingMesh = gltf.scene;

    // RESET EVERYTHING
    rotatingMesh.rotation.set(0, 0, 0);

    // FORCE THE MODEL TO STAND UP STRAIGHT
    rotatingMesh.rotateX(-Math.PI / 2);  // Flip from lying down
    rotatingMesh.rotateZ(Math.PI / 2);   // Adjust the sideways tilt

    rotatingMesh.position.set(0, 2, 0);
    rotatingMesh.scale.set(1, 1, 1);
    scene.add(rotatingMesh);
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the model:', error);
  }
);



// Define the spin axis to be the world up (Y) axis.
const spinAxis = new THREE.Vector3(0, 1, 0);

function animate() {
  requestAnimationFrame(animate);

  if (rotatingMesh) {
    rotatingMesh.rotateOnAxis(spinAxis, 0.01);
  }

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
