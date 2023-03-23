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