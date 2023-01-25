const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl2");

function glCreateShader(source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function setupFullscreenShader(vertSrc, fragSrc) {
  const program = gl.createProgram();
  gl.attachShader(program, glCreateShader(vertSrc, gl.VERTEX_SHADER));
  gl.attachShader(program, glCreateShader(fragSrc, gl.FRAGMENT_SHADER));
  gl.linkProgram(program);

  // add this for extra debugging
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var info = gl.getProgramInfoLog(program);
    throw new Error("Could not compile WebGL program. \n\n" + info);
  }

  gl.useProgram(program);

  // resize canvas
  const idCanvWidth = gl.getUniformLocation(program, "canvWidth");
  const idCanvHeight = gl.getUniformLocation(program, "canvHeight");

  gl.uniform1f(idCanvWidth, canvas.width);
  gl.uniform1f(idCanvHeight, canvas.height);

  addEventListener("resize", (event) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.uniform1f(idCanvWidth, canvas.width);
    gl.uniform1f(idCanvHeight, canvas.height);
  });

  return program;
}

function getFile(name) {
  const xhr = new XMLHttpRequest();
  xhr.open("get", name, false);
  xhr.send();
  return xhr.responseText;
}
