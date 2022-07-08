<canvas id="canvas" class="absolute top-0 left-0"></canvas>

<script>
import { onMount } from 'svelte/internal';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

onMount(async () => {
const THREE = await import('three');

//time between info add to visual
const cycleDelay = 500;

//creation of the 3D scene
const scene = new THREE.Scene();
scene.add( new THREE.AmbientLight( 0x443333 ) );

const geometry = new THREE.PlaneGeometry(window.innerWidth,window.innerHeight,50,50);;
const basicMatieral = new THREE.MeshBasicMaterial( { color: 0x000000 } );
const meshObject = new THREE.Mesh( geometry, basicMatieral );
scene.add( meshObject );

//helper constants for math later relative to screen and grid size
let width =  window.innerWidth;
let height = window.innerHeight;

//creates the ortho camera to view the visual
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
// @ts-ignore
camera.position.z = 120;
scene.add( camera );

//creates renderer and assigns the canvas from the DOM
const renderer = new THREE.WebGLRenderer(
  {
    canvas: document.querySelector('#canvas'),
  }
);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

//resizes the renderer when window size changes
function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize( width, height );
  camera.updateProjectionMatrix();
}

//recursive function to re-render the scene every frame the browser renders 
function animate() {
  requestAnimationFrame( animate );
  renderer.render(scene, camera);
}

//function calls
//setInterval(addDecal, cycleDelay);
animate();

});
</script>