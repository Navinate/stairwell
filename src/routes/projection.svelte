<script>
	import { onMount } from 'svelte/internal';
	import { WebGLRenderer } from 'three';

	onMount(async () => {
		const THREE = await import('three');

		//time between info add to visual
		const cycleDelay = 500;

		let clear_buffers = 2;
		let fbo_index = 0;

		fbo_index = (fbo_index + 1) % 2;

		let clock = new THREE.Clock();

		//creation of the 3D scene
		const scene = new THREE.Scene();
		scene.add(new THREE.AmbientLight(0x443333));

		//helper constants for math later relative to screen and grid size
		let width = window.innerWidth;
		let height = window.innerHeight;

		let mousePos = new THREE.Vector3(0, 0, 1);
		const vector = new THREE.Vector2();
		const dpr = window.devicePixelRatio;
		const textureSize = 128 * dpr;
		let texture = new THREE.FramebufferTexture(width, height, THREE.RGBAFormat);

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
		const sim_FS = `
			uniform vec3 u_mouse;
			uniform vec2 u_resolution;
			uniform float u_time;
			uniform sampler2D u_tex;
			uniform int clear;

			//        start point | end point
			float getDistance(vec2 sP, vec2 eP) {
				float xDiff = (eP.x - sP.x) * (eP.x - sP.x);
				float yDiff = (eP.y - sP.y) * (eP.y - sP.y);
				return sqrt(xDiff + yDiff);
			}

			void main() {
				vec3 e = vec3(vec2(1.)/u_resolution,0.);
				vec2 q = gl_FragCoord.xy/u_resolution;
				vec4 c = texture2D(u_tex, q);

				float p11 = c.y;
		
				float p10 = texture2D(u_tex, q-e.zy).x;
				float p01 = texture2D(u_tex, q-e.xz).x;
				float p21 = texture2D(u_tex, q+e.xz).x;
				float p12 = texture2D(u_tex, q+e.zy).x;
				
				float d = 0.;

				// Mouse interaction:
				if (u_mouse.z > 0.) {
					d = length(u_mouse.xy - gl_FragCoord.xy);
					d = smoothstep(1.5,.5,d);
					d *= sin(u_time*(4.+(u_mouse.z-1.)*4.))*.5*(u_mouse.z);
				}

				// The actual propagation:
				d += -p11 + (p10 + p01 + p21 + p12)*.5;
				d *= .999; // small dampening

				if (clear == 1) {
					d = (length(gl_FragCoord.xy - res.xy*.5) < 3.) ? .2 : 0.;
					//d = 0.;
				}
				
				// Set new current state and shift previous state:
				gl_FragColor = vec4(d,c.xyz);

				float h = texture2D(tex, gl_FragCoord.xy/res).x;
				float sh = .35-h;
				vec3 c =
					vec3(exp(pow(sh-.75,2.)*-10.),
							exp(pow(sh-.50,2.)*-20.),
							exp(pow(sh-.25,2.)*-10.));
				gl_FragColor = vec4(c,1.);
			}
    	`;
		const render_FS = `
			uniform sampler2D render_tex;
			uniform vec2 u_resolution;

			void main() {
				float h = texture2D(render_tex, gl_FragCoord.xy/u_resolution).x;
				float sh = .35-h;
				vec3 c =
					vec3(exp(pow(sh-.75,2.)*-10.),
							exp(pow(sh-.50,2.)*-20.),
							exp(pow(sh-.25,2.)*-10.));
				gl_FragColor = vec4(c,1.);
			}
		`;

		//CREATE SHADER UNIFORMS
		const uniforms = {
			u_resolution: { value: new THREE.Vector2(width, height) },
			u_mouse: { value: mousePos },
			u_time: { value: 0.0 },
			u_tex: { value: new THREE.Texture() },
			render_tex: { value: texture },
			clear: { value: clear_buffers > 0 ? 1 : 0 }
		};
		//CREATE SIM SHADER
		const simMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: _VS,
			fragmentShader: sim_FS
		});
		//CREATE RENDER SHADER
		const renderMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: _VS,
			fragmentShader: render_FS
		});

		//ADD SIM OBJECT
		// @ts-ignore
		const simObject = new THREE.Mesh(geometry, simMaterial);
		scene.add(simObject);

		//ADD RENDERED OBJECT
		// @ts-ignore
		const renderObject = new THREE.Mesh(geometry, renderMaterial);
		scene.add(renderObject);

		//recursive function to re-render the scene every frame the browser renders
		function animate() {
			requestAnimationFrame(animate);
			const delta = 5 * clock.getDelta();
			uniforms['u_time'].value += 0.2 * delta;

			renderObject.visible = false;
			simObject.visible = true;
			renderer.clear();
			vector.x = (window.innerWidth * dpr) / 2 - width / 2;
			vector.y = (window.innerHeight * dpr) / 2 - height / 2;
			renderer.copyFramebufferToTexture(vector, texture);
			uniforms['render_tex'].value = texture;

			simObject.visible = false;
			renderObject.visible = true;

			renderer.render(scene, camera);
		}

		//function calls
		//setInterval(addDecal, cycleDelay);
		animate();

		//updating mouse pos uniforms
		window.addEventListener('mousedown', (e) => {
			uniforms['u_mouse'].value.x = e.clientX;
			uniforms['u_mouse'].value.y = e.clientY;
			uniforms['u_mouse'].value.z = 1.0;
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

<style>
	* {
		user-select: none;
	}
</style>
