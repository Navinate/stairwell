// WHO5 Metaball

/*** Create GL program ***/

// program
const program = createProgram(getFile("tri.glsl"), getFile("energyballs.glsl"));
gl.useProgram(program);

// uniform locations
const idCanvWidth = gl.getUniformLocation(program, "canvWidth");
const idCanvHeight = gl.getUniformLocation(program, "canvHeight");

gl.uniform1f(idCanvWidth, canvas.width);
gl.uniform1f(idCanvHeight, canvas.height);

const idPartPos = gl.getUniformLocation(program, "positions");
const idColors = gl.getUniformLocation(program, "colors");
const idRadii = gl.getUniformLocation(program, "radii");
const idNumParts = gl.getUniformLocation(program, "numParts");

/*** Particle data ***/
let maxParticles = 256;

// particles aren't actually objects.
// they're arrays instead to easily send to the gpu
let particles = [];
const posSize = 2;
let positions = [];
const velSize = 2;
let velocities = [];
let radii = [];
const colorSize = 3;
let colors = [];

gl.uniform1fv(idRadii, radii);
gl.uniform1ui(idNumParts, 0);

// helper class for managing arrays sent to gpu
class Particle {
  constructor(fr, fg, fb, fRad, fSpeed) {

    // make sure max particles isn't exceeded
    if (particles.length > maxParticles)
      particles[particles.length - 1].destroy();

    this.index = particles.length;

    particles.push(this);

    gl.uniform1ui(idNumParts, particles.length);
    // x
    positions.push(Math.random() * canvas.width);
    // y
    positions.push(Math.random() * canvas.height);

    const fRandRad = Math.random() * Math.PI * 2;
    // x velocity
    velocities.push(Math.cos(fRandRad) * fSpeed);
    // y vel
    velocities.push(Math.sin(fRandRad) * fSpeed);

    // color r, g, & b
    colors.push(fr);
    colors.push(fg);
    colors.push(fb);

    gl.uniform3fv(idColors, colors);

    // radius
    radii.push(fRad);
    gl.uniform1fv(idRadii, radii);
  }

  destroy() {
    // remove data from arrays
    particles.splice(this.index);
    positions.splice(this.posIndex, posSize);
    velocities.splice(this.velIndex, velSize);
    radii.splice(this.index, 1);
    colors.splice(this.colorIndex, colorSize);

    // update gpu data
    gl.uniform1ui(idNumParts, particles.length);
    gl.uniform3fv(idColors, colors);
    gl.uniform1fv(idRadii, radii);
  }

  // position
  set x(f) {
    positions[this.index * posSize] = f;
  }

  set y(f) {
    positions[this.index * posSize + 1] = f;
  }

  setPos(fx, fy) {
    this.x = fx;
    this.y = fy;
  }

  get x() {
    return positions[this.index * posSize];
  }

  get y() {
    return positions[this.index * posSize + 1]
  }

  // velocity
  set vx(f) {
    velocities[this.index * velSize] = f;
  }

  set vy(f) {
    velocities[this.index * velSize + 1] = f;
  }

  setVel(fvx, fvy) {
    this.vx = fvx;
    this.vy = fvy;
  }

  velStep() {
    this.x += this.vx;
    this.y += this.vy;

    // constrain within screen
    if (this.x < 0) {
      this.vx = Math.abs(this.vx);
    } else if (this.x > canvas.width) {
      this.vx = -Math.abs(this.vx);
    }

    if (this.y < 0) {
      this.vy = Math.abs(this.vy);
    } else if (this.y > canvas.height) {
      this.vy = -Math.abs(this.vy);
    }
  }

  get vx() {
    return velocities[this.index * velSize];
  }

  get vy() {
    return velocities[this.index * velSize + 1]
  }

  // color - don't forget to send updated colors to gpu if you change them!
  set r(fr) {
    colors[this.index * colorSize] = fr;
  }

  set g(fg) {
    colors[this.index * colorSize + 1] = fg;
  }

  set b(fb) {
    colors[this.index * colorSize + 2] = fb;
  }

  setColor(fr, fg, fb) {
    this.r = fr;
    this.g = fg;
    this.b = fb;
  }

  get r() {
    return colors[this.index * colorSize];
  }

  get g() {
    return colors[this.index * colorSize + 1];
  }

  get b() {
    return colors[this.index * colorSize + 2];
  }

  // radius - don't forget to send updated radii array to gpu!
  set radius(fr) {
    radii[this.index] = fr;
  }

  get radius() {
    return radii[this.index];
  }
}

window.requestAnimationFrame(update);

function update() {
  for (let i = 0; i < particles.length; i++) {
    let iPart = particles[i];

    iPart.velStep();

    // handle collisions
    for (let j = i + 1; j < particles.length; j++) {
      let jPart = particles[j];

      let xDif = iPart.x - jPart.x;
      let yDif = iPart.y - jPart.y;

      let fDist = Math.sqrt(xDif * xDif + yDif * yDif);

      /** on collision **/
      if (fDist < iPart.radius + jPart.radius) {
        const vxDif = iPart.vx - jPart.vx;
        const vyDif = iPart.vy - jPart.vy;

        const fNormX = xDif / fDist;
        const fNormY = yDif / fDist;

        const fDotVel = fNormX * vxDif + fNormY * vyDif;

        iPart.vx += fNormX * -fDotVel;
        iPart.vy += fNormY * -fDotVel;

        jPart.vx += fNormX * fDotVel;
        jPart.vy += fNormY * fDotVel;

        // prevent stick by moving touching particles out of each other
        const fOverlap = (fDist - (radii[i] + radii[j])) / 2;
        let fDisplaceX = fNormX * fOverlap;
        let fDisplaceY = fNormY * fOverlap;

        iPart.x -= fDisplaceX;
        iPart.y -= fDisplaceY;

        jPart.x += fDisplaceX;
        jPart.y += fDisplaceY;
      }
    }
  }

  gl.uniform2fv(idPartPos, positions);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

  window.requestAnimationFrame(update);
}
