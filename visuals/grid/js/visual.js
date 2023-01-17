//const socket = io("ws://127.0.0.1:3000"); //LOCAL TESTING
const socket = io(); //LIVE SERVER
console.log("connected to websocket");

let balls = [];
let width = window.innerWidth;
let height = window.innerHeight;

function setup() {
  createCanvas(width, height);
  noStroke();
}

function draw() {
  background(0);
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].render();
  }
}

socket.on("server to listener", (color, a, b, c, d, e) => {
  console.log("recieved data");
  let size = map(a + b, 0, 200, 20, 100);
  let maxSpeed = map(c + d + e, 0, 300, 2, 3);
  balls.push(new Ball(color, size, maxSpeed));

  if (balls.length > 19) {
    balls.shift();
  }
  console.log("added data into new ball");
});

class Ball {
  constructor(color, size, maxSpeed) {
    let x = Math.random(0.7 * width) + 0.2 * width;
    let y = Math.random(0.7 * height) + 0.2 * height;
    this.pos = createVector(x, y);

    let vx = Math.random() * 10 - 5;
    let vy = Math.random() * 10 - 5;
    this.vel = createVector(vx, vy);
    this.vel.setMag(maxSpeed);

    this.color = color;
    this.size = size;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    if (this.pos.x >= width - this.size) {
      this.vel.x = -1 * this.vel.x;
      this.pos.x -= 10;
    }
    if (this.pos.x <= this.size) {
      this.vel.x = -1 * this.vel.x;
      this.pos.x += 10;
    }
    if (this.pos.y >= height - this.size) {
      this.vel.y = -1 * this.vel.y;
      this.pos.y -= 10;
    }
    if (this.pos.y <= this.size) {
      this.vel.y = -1 * this.vel.y;
      this.pos.y += 10;
    }
  }

  render() {
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.size * 2);
  }
}
