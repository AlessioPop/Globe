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
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
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

// Load your Blender asset (exported as glTF/glb)
const loader = new GLTFLoader().setPath('public/');
loader.load(
  'MyAsset.glb',
  (gltf) => {
    rotatingMesh = gltf.scene;
    
    // Rotate the object to bring it upright.
    // Adjust the value depending on your model's orientation.
    rotatingMesh.rotation.x = 0 * Math.PI / 2; // try -Math.PI / 2 if needed

    rotatingMesh.position.set(0, 2, 0);
    rotatingMesh.scale.set(1, 1, 1);
    scene.add(rotatingMesh);
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the model:', error);
  }
);

// Define the spin axis for local rotation (adjust if necessary)
const spinAxis = new THREE.Vector3(0, 0, 1);

function animate() {
  requestAnimationFrame(animate);

  if (rotatingMesh) {
    // Rotate the asset around its local z axis (or change the axis as needed)
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
