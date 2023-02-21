//const socket = io("ws://127.0.0.1:3000"); //LOCAL TESTING
const socket = io(); //LIVE SERVER
console.log("connected to websocket");

document.querySelectorAll("input").forEach((rb) => {
  rb.style.backgroundColor = rb.value;
});

const caps = ["ROUND", "SQUARE", "PROJECT"];
const joins = ["MITER", "BEVEL", "ROUND"];
let gest;
let cnv;

function setup() {
  cnv = createCanvas(400, 400);
  cnv.mouseReleased(mouseUpAndSendData);
  frameRate(60);
  gest = new Gesture(color(0), 20, "ROUND", "ROUND");
}
let index = 0;
function draw() {
  background(255);
  if (mouseIsPressed) {
    if (pmouseX < width && pmouseX > 0) {
      if (pmouseY < height && pmouseY > 0) {
        gest.addPoint(pmouseX, pmouseY);
        index++;
        if (index > 25) {
          mouseUpAndSendData();
          index = 0;
        }
      }
    }
  }

  gest.render();
}

function mouseUpAndSendData() {
  if (gest.points.length > 0) {
    sendData();
  }
  noLoop();
  gest.points = [];
}

function sendData() {
  let colorValue = document.querySelector("input:checked").value;
  gest.normalizePoints();
  socket.emit("gesture to server", colorValue, gest.points);
}
