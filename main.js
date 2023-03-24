var vertices = [];
var colors = [];
var translation = [0, 0, 0];
var rotation = [degToRad(0), degToRad(0), degToRad(0)];
var scale = [1, 1, 1];
var projectionMode = "orthographic";
var shadingEnabled = false;

// Initialize the WebGL context
var canvas = document.querySelector("#gl-canvas");
var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
if (!gl) {
  alert("WebGL not available");
}

// Create, upload, and compile the shaders
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Link the two shaders above into a program
var program = createProgram(gl, vertexShader, fragmentShader);

gl.useProgram(program);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");
var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
var matrixLocation = gl.getUniformLocation(program, "u_matrix");

// Set viewport
gl.viewport(0, 0, canvas.width, canvas.height);

const updateAngleX = () => {
  var angleX = document.getElementById("angleX").value;
  rotation[0] = degToRad(angleX);
  document.getElementById("angleX-value").innerHTML = angleX;
  drawScene();
};

const updateAngleY = () => {
  var angleY = document.getElementById("angleY").value;
  rotation[1] = degToRad(angleY);
  document.getElementById("angleY-value").innerHTML = angleY;
  drawScene();
};

const updateAngleZ = () => {
  var angleZ = document.getElementById("angleZ").value;
  rotation[2] = degToRad(angleZ);
  document.getElementById("angleZ-value").innerHTML = angleZ;
  drawScene();
};

const updateScaleX = () => {
  var scaleX = document.getElementById("scaleX").value;
  scale[0] = scaleX;
  document.getElementById("scaleX-value").innerHTML = scaleX;
  drawScene();
};

const updateScaleY = () => {
  var scaleY = document.getElementById("scaleY").value;
  scale[1] = scaleY;
  document.getElementById("scaleY-value").innerHTML = scaleY;
  drawScene();
};

const updateScaleZ = () => {
  var scaleZ = document.getElementById("scaleZ").value;
  scale[2] = scaleZ;
  document.getElementById("scaleZ-value").innerHTML = scaleZ;
  drawScene();
};

const updateTranslateX = () => {
  var translateX = parseFloat(document.getElementById("translateX").value);
  // translation[0] = toCanvasX(canvas, translateX, 10);
  translation[0] = translateX;
  document.getElementById("translateX-value").innerHTML = translateX;
  drawScene();
};

const updateTranslateY = () => {
  var translateY = parseFloat(document.getElementById("translateY").value);
  // translation[1] = toCanvasY(canvas, translateY, 10);
  translation[1] = translateY;
  document.getElementById("translateY-value").innerHTML = translateY;
  drawScene();
};

const updateTranslateZ = () => {
  var translateZ = parseFloat(document.getElementById("translateZ").value);
  // translation[2] = toCanvasZ(translateZ, 10);
  translation[2] = translateZ;
  // console.log(translation[2]);
  document.getElementById("translateZ-value").innerHTML = translateZ;
  drawScene();
};

const updateProjectionMode = () => {
  projectionMode = document.getElementById("projection-type").value;
  console.log(projectionMode)
  drawScene();
};

const toggleShading = () => {
  shadingEnabled = !shadingEnabled;
  var text = shadingEnabled ? "On" : "Off";
  document.getElementById("shading-label").innerHTML = text;
  drawScene();
};

function render(vertice, color) {
  var buffer = gl.createBuffer();
  // var obj = loadObject();
  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);

  var faceColors = [];
  for (var j = 0; j < color.length; ++j) {
      const c = color[j];
      for (var i = 0; i < 4; ++i) {
          faceColors = faceColors.concat(c);
      }
  }

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faceColors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    colorAttributeLocation,
    4,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(colorAttributeLocation);

  const indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,   0, 2, 3,    // front
      4, 5, 6,   4, 6, 7,    // back
      8, 9, 10,  8, 10, 11,  // top
      12, 13, 14, 12, 14, 15,  // bottom
      16, 17, 18, 16, 18, 19,  // right
      20, 21, 22, 20, 22, 23,  // left
      ]),
    gl.STATIC_DRAW);
}

function loadObject() {
  let vertice = hollowObject.points;
  let vertexSorted = [];
  let colorSorted = [];
  for (let i = 0; i < hollowObject.rusuk.length; i++) {
    let point = hollowObject.rusuk[i];
    let tmpColor = [];
    let position = [];
    for(let j = 0; j < point.topologi.length; j++){
      position = position.concat(vertice[point.topologi[j][0]]);
      position = position.concat(vertice[point.topologi[j][1]]);
      position = position.concat(vertice[point.topologi[j][2]]);
      position = position.concat(vertice[point.topologi[j][3]]);
      tmpColor.push(point.color[j]);
    }
    colorSorted.push(tmpColor);
    vertexSorted.push(position);
  }
  vertices = vertexSorted;
  colors = colorSorted;
  drawScene();
}

function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event){
  hollowObject = JSON.parse(event.target.result);
  loadObject();
}

document.getElementById('load').addEventListener('change', onChange); 

function drawScene() {
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a rectangle
  var offsetNow = 0;
  var countNow = 0;
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for (let i = 0; i < vertices.length; i++) {
    const fieldOfView = (60 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    // var left = 0;
    // var right = gl.canvas.clientWidth;
    // var bottom = gl.canvas.clientHeight;
    // var top = 0;
    var left = -10;
    var right = 10;
    var bottom = -10;
    var top = 10;
    var near = 0.1;
    var far = 100;
    var count = vertices[i].length/2;
    render(vertices[i], colors[i]);
    var matrix = m4.identity();
    // var projectionMatrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);

    if (projectionMode == "orthographic") {
      matrix = m4.orthographic(left, right, bottom, top, near, far);
    } else if (projectionMode == "perspective") {
      matrix = m4.perspective(fieldOfView, aspect, zNear, zFar);
    } else if (projectionMode == "oblique") {
    }

    matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
    // matrix = m4.multiply(projectionMatrix, matrix);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.drawElements(this.gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
  }
}

function resetDefault() {
  rotation = [0, 0, 0];
  scale = [1, 1, 1];
  translation = [0, 0, 0];
  document.getElementById("angleX").value = 0;
  document.getElementById("angleY").value = 0;
  document.getElementById("angleZ").value = 0;
  document.getElementById("scaleX").value = 1;
  document.getElementById("scaleY").value = 1;
  document.getElementById("scaleZ").value = 1;
  document.getElementById("translateX").value = 0;
  document.getElementById("translateY").value = 0;
  document.getElementById("translateZ").value = 0;
  document.getElementById("angleX-value").innerHTML = 0;
  document.getElementById("angleY-value").innerHTML = 0;
  document.getElementById("angleZ-value").innerHTML = 0;
  document.getElementById("scaleX-value").innerHTML = 1;
  document.getElementById("scaleY-value").innerHTML = 1;
  document.getElementById("scaleZ-value").innerHTML = 1;
  document.getElementById("translateX-value").innerHTML = 0;
  document.getElementById("translateY-value").innerHTML = 0;
  document.getElementById("translateZ-value").innerHTML = 0;
  drawScene();
}