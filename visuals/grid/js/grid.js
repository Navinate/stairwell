let width = window.innerWidth;
let height = window.innerHeight;

let ratio = width / height;

let grid = [];
let gridMarker = 0;
let cols = 7;
let rows = Math.round(cols * ratio);
let colsOffset = height / cols;
let rowsOffset = width / rows;

function setup() {
  createCanvas(width, height);
  stroke("#FFFFFF");
  noStroke();
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      grid[x + y * rows] = new Panel(x, y);
    }
  }

  grid = shuffle(grid);
  background(0);
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      grid[x + y * rows].render();
    }
  }
}

function draw() {}

function mousePressed() {
  grid[gridMarker].setData(
    "#" + [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100
  );
  grid[gridMarker].render();
  gridMarker++;
  if (gridMarker >= grid.length) {
    gridMarker = 0;
  }
}

class Panel {
  constructor(x, y) {
    this.pos = createVector(x * rowsOffset, y * colsOffset);
    this.color = "#000000";
    this.a = 50;
    this.b = 50;
    this.c = 50;
    this.d = 50;
    this.e = 50;
  }

  setData(color, a, b, c, d, e) {
    this.color = color;
    this.a = map(a, 0, 100, 0, 50);
    this.b = map(b, 0, 100, 0, 50);
    this.c = map(c, 0, 100, 0, 50);
    this.d = map(d, 0, 100, 0, 50);
    this.offset = map(e, 0, 100, 0, 50);
  }

  update() {}

  render() {
    fill(this.color);
    rect(
      this.pos.x - this.offset / 2,
      this.pos.y - this.offset / 2,
      rowsOffset + this.offset,
      colsOffset + this.offset,
      this.a,
      this.b,
      this.c,
      this.d
    );
  }
}

setInterval(mousePressed, 500);

//helper shuffle function snagged from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
