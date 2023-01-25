//const socket = io("ws://127.0.0.1:3000"); //LOCAL TESTING
const socket = io(); //LIVE SERVER
console.log("connected to websocket");
let sliders = document.querySelectorAll(".slider");
randomizeForm();

document.querySelector("#submit-button").onclick = () => {
  console.log("submitting data");
  let color = document.querySelector("#color-field").value;
  let a = sliders[0].value;
  let b = sliders[1].value;
  let c = sliders[2].value;
  let d = sliders[3].value;
  let e = sliders[4].value;
  let text = textField.value;
  socket.emit("form to server", color, a, b, c, d, e, text);
  panelIndex = 0;
  panels[panelIndex].style.display = "flex";
  randomizeForm();
  window.location.href = "../results/";
};

function randomizeForm() {
  sliders.forEach((slider) => {
    slider.value = Math.random() * 100;
  });
  //gen random hex code
  document.querySelector("#color-field").value =
    "#" + [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}
