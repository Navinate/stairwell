<canvas id="canvas" class="absolute top-0 left-0"></canvas>

<script>
import { onMount } from 'svelte/internal';

onMount(async () => {
  const THREE = await import('three');

  //creation of the 3D scene
  const scene = new THREE.Scene();

  //shader uniforms
  let uniforms = {
    time: { value: 1.0 }
  };

  //how many chunks per axis (10 means 10x10 grid of squares, 100 total)
  const gridSize = 10;
  //time between info add to visual
  const cycleDelay = 250;

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

  //creates the geometry template for all meshes later
  const geometry = new THREE.PlaneGeometry(widthInterval, heightInterval, 1,1);

  // create 2D array to store material for each square
  const materialArray = new Array(gridSize);
  for(let i = 0; i < materialArray.length; i++) {
    materialArray[i] = new Array(gridSize);
  }

  //sets up Three.js settings and stuff
  function setupThree() {
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
  }

  // creates the material for each space in the 2D material array to later be assigned to meshes
  async function initMaterials() {
    for(let i = 0; i < materialArray.length; i++) {
      for(let j = 0; j < materialArray[i].length; j++) {

        //create THREEJS material for the geometry
        materialArray[i][j] = new THREE.MeshBasicMaterial(
          {
            color: new THREE.Color('#000000'),
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
  }
  //creates the meshes to be rendered by cycleing through the material array
  function createMesh() {
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
  }

  async function addColor() {
    
        let i = Math.floor(Math.random() * materialArray.length);
        let j = Math.floor(Math.random() * materialArray[0].length);

        let color = await (await fetch('./color')).text();
        console.log('added color: ' + color + ' to position (' + i + ',' + j + ')');

        //create THREEJS material for the geometry
        materialArray[i][j] = new THREE.MeshBasicMaterial(
          {
            color: new THREE.Color(color),
            wireframe: false
          }
        );  
        createMesh();
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

  //function calls
  setupThree();
  await initMaterials();
  createMesh();
  setInterval(addColor, cycleDelay);
  animate();

});
</script>