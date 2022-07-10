<script>
	import { onMount } from 'svelte/internal';

	onMount(async () => {
		const THREE = await import('three');

		//time between info add to visual
		const cycleDelay = 500;

		let clock = new THREE.Clock();

		//creation of the 3D scene
		const scene = new THREE.Scene();
		scene.add(new THREE.AmbientLight(0x443333));

		//helper constants for math later relative to screen and grid size
		let width = window.innerWidth;
		let height = window.innerHeight;

		let mousePos = new THREE.Vector2(500, 500);

		//creates the ortho camera to view the visual
		const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
		// @ts-ignore
		camera.position.z = 120;
		scene.add(camera);

		//creates renderer and assigns the canvas from the DOM
		const renderer = new THREE.WebGLRenderer({
			canvas: document.querySelector('#canvas')
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);

		//CREATE BACKGROUND PLANE
		const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 50, 50);

		//SHADERS
		const _VS = `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
		const _FS = `

      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      uniform float u_time;

      void main() {
        vec2 uv = gl_FragCoord.xy/u_resolution.xy; 

        float l = u_time;
        vec2 p = uv;
        vec2 uv2 = p;

        p.x -= (u_mouse.x * 0.001) - .5;
        p.y += (u_mouse.y * 0.001) - 1.;
        l = length(p);
        uv2 += abs( sin( l * 10.0 - u_time) );
        float point = 0.01 / length( mod(uv2 , 1.0) - 0.5 );
        
        vec3 c = vec3(point);
        
        gl_FragColor = vec4( c/l , u_time);
      }
    `;
		//CREATE SHADER UNIFORMS
		const uniforms = {
			u_resolution: { value: new THREE.Vector2(width, height) },
			u_mouse: { value: mousePos },
			u_time: { value: 0.0 }
		};
		//CREATE BACKGROUND SHADER
		const shaderMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: _VS,
			fragmentShader: _FS
		});

		//ADD BACKGROUND TO SCENE
		// @ts-ignore
		const meshObject = new THREE.Mesh(geometry, shaderMaterial);
		scene.add(meshObject);

		//recursive function to re-render the scene every frame the browser renders
		function animate() {
			requestAnimationFrame(animate);
			const delta = 5 * clock.getDelta();
			uniforms['u_time'].value += 0.2 * delta;
			renderer.render(scene, camera);
		}

		//function calls
		//setInterval(addDecal, cycleDelay);
		animate();

		//updating mouse pos uniforms
		window.addEventListener('mousemove', (e) => {
			uniforms['u_mouse'].value.x = e.clientX;
			uniforms['u_mouse'].value.y = e.clientY;
		});

		/* -------- HELPER FUNCTIONS -------- */

		//resizes the renderer when window size changes
		function onWindowResize() {
			width = window.innerWidth;
			height = window.innerHeight;
			renderer.setSize(width, height);
			camera.updateProjectionMatrix();
		}
	});
</script>

<canvas id="canvas" class="absolute top-0 left-0" />
