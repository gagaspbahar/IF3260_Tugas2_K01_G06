function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

const toCanvasX = (canvas, x, base) => {
  let newX = x;
  newX = (newX + base)/(2*base) * canvas.width;
  return newX;
}

const toCanvasY = (canvas, y, base) => {
  let newY = y;
  newY = (newY + base)/(2*base) * canvas.height;
  return newY;
}

const toCanvasZ = (z, base) => {
  let newZ = z;
  newZ = (newZ + base)/(2*base) * (-2000);
  return newZ;
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}
