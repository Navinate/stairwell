<canvas id="canvas" class="absolute top-0 left-0"></canvas>

<script>
import { onMount } from 'svelte/internal';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

onMount(async () => {
const THREE = await import('three');

//time between info add to visual
const cycleDelay = 500;
const fadeSpeed = 0.001;

//DECAL PRESETS
let raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3()
};
// @ts-ignore
const intersects = [];
// @ts-ignore
const decals = [];
let position = new THREE.Vector3(0,0,0);
const orientation = new THREE.Euler(0,0,0);
const size = new THREE.Vector3( 10, 10, 10 );

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

  //needs intersection.point and 
async function addDecal() {
  let x = Math.random() * (width-(width*0.2) + (width*0.2));
  let y = Math.random() * (height-(height*0.2) + (height*0.2));
  checkIntersection(x, y);
  if ( intersection.intersects ) {
    position.copy( intersection.point );
    orientation.z = Math.random() * 2 * Math.PI;
    const scale = 10 + Math.random() * ( 20 - 10 );
    size.set( scale, scale, scale );
    let color = new THREE.Color( await (await fetch('./color')).text() );
    const material = new THREE.MeshBasicMaterial( { color: color } )
    console.log(material.color);
    const m = new THREE.Mesh(new DecalGeometry( meshObject, position, orientation, size ), material );
    scene.add( m );
    decals.push( m );
  }

  if(decals.length > 20) {
    // @ts-ignore
    scene.remove(decals.shift());
  }
}

// @ts-ignore
function checkIntersection( x, y ) {
  if ( meshObject === undefined ) return;
  mouse.x = ( x / window.innerWidth ) * 2 - 1;
  mouse.y = - ( y / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  // @ts-ignore
  raycaster.intersectObject( meshObject, false, intersects );
  if ( intersects.length > 0 ) {
    // @ts-ignore
    const p = intersects[ 0 ].point;
    intersection.point.copy( p );

    // @ts-ignore
    const n = intersects[ 0 ].face.normal.clone();
    n.transformDirection( meshObject.matrixWorld );
    n.multiplyScalar( 10 );
    // @ts-ignore
    n.add( intersects[ 0 ].point );

    // @ts-ignore
    intersection.normal.copy( intersects[ 0 ].face.normal );
    intersection.intersects = true;

    intersects.length = 0;

  } else {
    intersection.intersects = false;
    console.log('miss');
  }

}

//recursive function to re-render the scene every frame the browser renders 
function animate() {
  requestAnimationFrame( animate );
  meshObject.material.color.multiply(0x000000);
  // @ts-ignore
  decals.forEach( function ( d ) {
    d.material.color.sub(new THREE.Color(fadeSpeed, fadeSpeed, fadeSpeed));
  } );
  renderer.render(scene, camera);
}

//function calls
setInterval(addDecal, cycleDelay);
animate();

});
</script>