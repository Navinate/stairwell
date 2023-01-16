const socket = io();
let sliders = document.querySelectorAll(".slider");
sliders.forEach((slider) => {
  slider.value = Math.random() * 100;
});

document.querySelector("#color-field").value = generateHexCode();

document.querySelector("#submit-button").onclick = () => {
  let color = document.querySelector("#color-field").value;
  let a = sliders[0].value;
  let b = sliders[1].value;
  let c = sliders[2].value;
  let d = sliders[3].value;
  let e = sliders[4].value;
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
