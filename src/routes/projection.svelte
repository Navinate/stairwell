<canvas id="canvas" class="absolute top-0 left-0"></canvas>

<script>
import { onMount } from 'svelte/internal';
onMount(async () => {
const THREE = await import('three');

//creation of the 3D scene
const scene = new THREE.Scene();

//how many chunks per axis (10 means 10x10 grid of squares, 100 total)
const gridSize = 10;

//helper constants for math later relative to screen and grid size

let width =  window.innerWidth;
let height = window.innerHeight;
let widthInterval = width / gridSize;
let heightInterval = height / gridSize;

//creates the ortho camera to view the visual
const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
scene.add( camera );

//creates renderer and assigns the canvas from the DOM
const renderer = new THREE.WebGLRenderer(
  {
    canvas: document.querySelector('#canvas'),
  }
);

//sets renderer to display properly on device
renderer.setPixelRatio( 1 );//window.devicePixelRatio );
renderer.setSize( width, height );

//set coord origin to top left of screen and move camera back to make objects visible
// @ts-ignore
camera.position.setZ(1);
// @ts-ignore
camera.position.setX(width/2);
// @ts-ignore
camera.position.setY(-height/2);


//creates the geometry template for all meshes later
const geometry = new THREE.PlaneGeometry(widthInterval, heightInterval, 1,1);

// create 2D array to store material for each square
const materialArray = new Array(gridSize);
for(let i = 0; i < materialArray.length; i++) {
  materialArray[i] = new Array(gridSize);
}

let uniforms = {
  time: { value: 1.0 }
};

// creates the material for each space in the 2D material array to later be assigned to meshes
for(let i = 0; i < materialArray.length; i++) {

  for(let j = 0; j < materialArray[i].length; j++) {

    //pulling data from json file
    //TODO: GRAB DATA FROM DATABASE ENDPOINT
    let color = await (await fetch('./color')).text();
    //create THREEJS material for the geometry
    
    materialArray[i][j] = new THREE.MeshBasicMaterial(
      {
        color: new THREE.Color(color),
        wireframe: false
      }
    );
    

     /*materialArray[i][j] = new THREE.ShaderMaterial( {

      uniforms: uniforms,
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
      wireframe: false

    } ); 
    */
  }
}

//creates the meshes to be rendered by cycleing through the material array
for(let i = 0; i < materialArray.length; i++) {
  for(let j = 0; j < materialArray[i].length; j++) {

    //create the mesh and assigns the geometry and material
    let plane = new THREE.Mesh( geometry, materialArray[i][j]);

    //reposition the plane to its spaced out array index AND so the top left corner is on that coord
    //this is to allign the grid with the viewport
    // @ts-ignore
    plane.position.x = i * widthInterval + (widthInterval / 2);
    // @ts-ignore
    plane.position.y = -j * heightInterval - (heightInterval / 2);

    //add the plane to the rendered scene
    scene.add( plane );
  }
  
}

//resizes the renderer when window size changes
function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  widthInterval = width / gridSize;
  heightInterval = height / gridSize;
  renderer.setSize( width, height );
  //renderer.render(scene, camera);
}

//recursive function to re-render the scene every frame the browser renders 
function animate() {
  requestAnimationFrame( animate );

  //updates time for the shader
  uniforms[ 'time' ].value = performance.now() / 1000;

  renderer.render(scene, camera);
}

animate();

});
</script>