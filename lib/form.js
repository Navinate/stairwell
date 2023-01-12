const socket = io("ws://localhost:3000");

document.querySelector("button").onclick = () => {
  let color = document.querySelector("#color-field").value;
  let a = Math.random() * 100;
  let b = Math.random() * 100;
  let c = Math.random() * 100;
  let d = Math.random() * 100;
  let e = Math.random() * 100;
  socket.emit("form to server", color, a, b, c, d, e);
};
