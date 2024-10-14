import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);
camera.lookAt(0, 0, 0);

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5);
spotLight.position.set(0, 25, 0);
scene.add(spotLight);

// Variable to store the loaded GLTF mesh
let rotatingMesh = null;

const loader = new GLTFLoader().setPath('public/');
loader.load('RedSphere2.gltf', (gltf) => {
  rotatingMesh = gltf.scene;
  rotatingMesh.position.set(0, 2, 0);
  rotatingMesh.scale.set(0.5, 0.5, 0.5); // You can adjust these values as needed
  scene.add(rotatingMesh);
}, undefined, (error) => {
  console.error('An error occurred while loading the model:', error);
});

function animate() {
  requestAnimationFrame(animate);

  // Rotate the mesh if it's loaded
  if (rotatingMesh) {
    rotatingMesh.rotation.y += 0.01; // Rotate along the Y axis
    rotatingMesh.rotation.x += 0.005; // Optionally rotate along the X axis
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
