const socket = io();
let sliders = document.querySelectorAll(".slider");
sliders.forEach((slider) => {
  slider.value = Math.random() * 100;
});

document.querySelector("#color-field").value = generateHexCode();

document.querySelector("#submit-button").onclick = () => {
  let color = document.querySelector("#color-field").value;
  let a = Math.random() * 100;
  let b = Math.random() * 100;
  let c = Math.random() * 100;
  let d = Math.random() * 100;
  let e = Math.random() * 100;
  socket.emit("form to server", color, a, b, c, d, e);
};

function generateHexCode() {
  return (
    "#" +
    [...Array(6)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")
  );
}
