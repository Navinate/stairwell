/*** Socket ***/

// set max particles to 15
  maxParticles = 100;

const socket = io("wss://navinate.com/");

//simple hexcode to rgb method
const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // return {r, g, b}
    return { r, g, b };
};

socket.on("server to listener", (color, a, b, c, d, e) => {
    rgb = hex2rgb(color);

    // a/2+50 ranges between 50-100
    new Particle(rgb.r / 255, rgb.g / 255, rgb.b / 255, 5 + a / 100 * 50 , b / 100 * 2);
});