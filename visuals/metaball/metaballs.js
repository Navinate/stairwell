/*** Create GL program ***/

// program
const program = setupFullscreenShader(getFile("tri.glsl"), getFile("metaballs.glsl"));

const idNumParts = gl.getUniformLocation(program, "numParts");
const idPositions = gl.getUniformLocation(program, "positions");
const idColors = gl.getUniformLocation(program, "colors");
const idTraits = gl.getUniformLocation(program, "traits");

/*** Particle data ***/
let maxParticles = 256;

// particles aren't actually objects.
// they're arrays instead to easily send to the gpu
let particles = [];

const vPositionSize = 3;
let vPositions = [];

const vColorSize = 3;
let vColors = [];

const vTraitSize = 4;
let vTraits = [];

gl.uniform1ui(idNumParts, 0);

// helper class for managing arrays sent to gpu
class Particle {
  constructor(fr, fg, fb, fRad, fSpeed, fMagnet) {

    // make sure max particles isn't exceeded
    if (particles.length > maxParticles)
      particles[particles.length - 1].destroy();

    this.index = particles.length;

    particles.push(this);
    gl.uniform1ui(idNumParts, particles.length);

    // position
    vPositions.push(Math.random() * canvas.width, Math.random() * canvas.height, 10);

    // velocity
    const fRandRad = Math.random() * Math.PI * 2;
    this.vx = Math.cos(fRandRad) * fSpeed;
    this.vy = Math.sin(fRandRad) * fSpeed;

    // color
    vColors.push(fr, fg, fb);
    gl.uniform3fv(idColors, vColors);

    // traits (radius, tbd, tbd, tbd)
    vTraits.push(fRad, 0.0, 0.0, 0.0);
    gl.uniform4fv(idTraits, vTraits);

    // force
    this.magForce = fMagnet;
  }

  destroy() {
    // remove data from arrays
    particles.splice(this.index);
    vPositions.splice(this.index * vPositionSize, vPositionSize);
    vColors.splice(this.index * vColorSize, vColorSize);
    vTraits.splice(this.index * vTraitSize, vTraitSize);

    // update gpu data
    gl.uniform1ui(idNumParts, particles.length);
    gl.uniform3fv(idPositions, vPositions);
    gl.uniform3fv(idColors, vColors);
    gl.uniform4fv(idTraits, vTraits);
  }

  // position
  set x(f) {
    vPositions[this.index * vPositionSize] = f;
  }

  set y(f) {
    vPositions[this.index * vPositionSize + 1] = f;
  }

  setPos(fx, fy) {
    this.x = fx;
    this.y = fy;
  }

  get x() {
    return vPositions[this.index * vPositionSize];
  }

  get y() {
    return vPositions[this.index * vPositionSize + 1]
  }

  // glow
  set glow(f) {
    vPositions[this.index * vPositionSize + 2] = f;
  }

  get glow() {
    return vPositions[this.index * vPositionSize + 2];
  }

  // velocity

  velStep() {
    this.x += this.vx;
    this.y += this.vy;

    this.glow *= 0.95;

    // for(let i = 0; i < colliders.length; i++) {
    //   let col = colliders[i];
    //
    //   let pastLeft = this.x > col.x;
    //   let pastRight = this.x < col.x + col.w;
    //
    //   let pastTop = this.y > col.y;
    //   let pastBottom = this.y < col.y + col.h;
    //
    //
    //   let overlapX = pastLeft && pastRight;
    //   let overlapY = pastTop && pastBottom;
    //
    //   if(overlapX && overlapY) {
    //     if(overlapX  ) {
    //
    //     }
    //
    //     this.vx = Math.abs(this.vx) * Math.sign(this.x - (col.x + col.w / 2));
    //     this.vy = Math.abs(this.vy) * Math.sign(this.y - (col.y + col.h / 2));
    //   }
    // }

    // constrain within screen

    if (this.x < 0) {
      this.x = 0;
      this.vx = Math.abs(this.vx);
    } else if (this.x > canvas.width) {
      this.x = canvas.width;
      this.vx = -Math.abs(this.vx);
    }

    if (this.y < 0) {
      this.y = 0;
      this.vy = Math.abs(this.vy);
    } else if (this.y > canvas.height) {
      this.y = canvas.height;
      this.vy = -Math.abs(this.vy);
    }
  }

  // color - don't forget to send updated colors to gpu if you change them!
  set r(fr) {
    vColors[this.index * vColorSize] = fr;
  }

  set g(fg) {
    vColors[this.index * vColorSize + 1] = fg;
  }

  set b(fb) {
    vColors[this.index * vColorSize + 2] = fb;
  }

  setColor(fr, fg, fb) {
    this.r = fr;
    this.g = fg;
    this.b = fb;
  }

  get r() {
    return vColors[this.index * vColorSize];
  }

  get g() {
    return vColors[this.index * vColorSize + 1];
  }

  get b() {
    return vColors[this.index * vColorSize + 2];
  }

  // radius - don't forget to send updated radii array to gpu!
  set radius(fr) {
    vTraits[this.index * vTraitSize] = fr;
  }

  get radius() {
    return vTraits[this.index * vTraitSize];
  }
}

// sound effects

// let collisionSounds = [new Audio('sfx/AIA_PluckDb_0923.mp3'), new Audio('sfx/AIA_PluckEb_0923.mp3'), new Audio('sfx/AIA_PluckBb_1111.mp3')];


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

      const fNormX = xDif / fDist * (iPart.magForce + jPart.magForce);
      const fNormY = yDif / fDist * (iPart.magForce + jPart.magForce);

      iPart.vx += fNormX / fDist;
      iPart.vy += fNormY / fDist;
      jPart.vx -= fNormX / fDist;
      jPart.vy -= fNormY / fDist;

      //
      // /** on collision **/
      // if (fDist < iPart.radius + jPart.radius) {
      //
      //   let sound = collisionSounds[Math.floor(Math.random() * collisionSounds.length)].cloneNode(true);
      //   sound.volume = 0.5;
      //   sound.play();
      //   iPart.glow = 1;
      //   jPart.glow = 1;
      //
      //   const vxDif = iPart.vx - jPart.vx;
      //   const vyDif = iPart.vy - jPart.vy;
      //
      //
      //   const fDotVel = fNormX * vxDif + fNormY * vyDif;
      //
      //   iPart.vx += fNormX * -fDotVel;
      //   iPart.vy += fNormY * -fDotVel;
      //
      //   jPart.vx += fNormX * fDotVel;
      //   jPart.vy += fNormY * fDotVel;
      //
      //   // prevent stick by moving touching particles out of each other
      //   const fOverlap = (fDist - (vTraits[i * vTraitSize] + vTraits[j * vTraitSize])) / 2;
      //   let fDisplaceX = fNormX * fOverlap;
      //   let fDisplaceY = fNormY * fOverlap;
      //
      //   iPart.x -= fDisplaceX;
      //   iPart.y -= fDisplaceY;
      //
      //   jPart.x += fDisplaceX;
      //   jPart.y += fDisplaceY;
      // }
    }
  }

  gl.uniform3fv(idPositions, vPositions);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

  window.requestAnimationFrame(update);
}