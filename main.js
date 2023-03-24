var vertices = [];
var indices = defaultIndices;
var hollowObject = defaultObject;
var colors = [];
var normals = [];
var translation = [0, 0, 0];
var rotation = [degToRad(0), degToRad(0), degToRad(0)];
var scale = [1, 1, 1];
var projectionMode = "orthographic";
var shadingEnabled = false;
var animationActive = false;
var rotateX = 0;
var rotateY = 0;
var rotateZ = 0;
var rotateAxis = 0;
var reqAnime = null;
var cameraAngleRadians = degToRad(0);
var cameraRadius = 20;
var cameraTarget = [0, 0, 0];
var cameraPosition = [0, 0, -5];

var lightDirection = [0.5, 0.3, -1];

var fieldOfView = (60 * Math.PI) / 180; // in radians
var zNear = 1;
var zFar = 2000;
var left = -10;
var right = 10;
var bottom = -10;
var topFov = 10;
var near = -100;
var far = 100;
var up = [0, 1, 0];


// Initialize the WebGL context
var canvas = document.querySelector("#gl-canvas");
var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
if (!gl) {
  alert("WebGL not available");
}
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

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
var normalLocation = gl.getAttribLocation(program, "a_normal");
var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
var reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
var useLightingLocation = gl.getUniformLocation(program, "u_useLighting");

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

const updateCameraX = () => {
  var cameraX = parseFloat(document.getElementById("cameraX").value);
  cameraPosition[0] = cameraX;
  document.getElementById("cameraX-value").innerHTML = cameraX;
  drawScene();
}

const updateCameraY = () => {
  var cameraY = parseFloat(document.getElementById("cameraY").value);
  cameraPosition[1] = cameraY;
  document.getElementById("cameraY-value").innerHTML = cameraY;
  drawScene();
}

const updateCameraZ = () => {
  var cameraZ = parseFloat(document.getElementById("cameraZ").value);
  cameraPosition[2] = cameraZ;
  document.getElementById("cameraZ-value").innerHTML = cameraZ;
  drawScene();
}

const updateCameraRadius = () => {
  var cameraRadiusTemp = parseFloat(document.getElementById("cameraRadius").value);
  cameraRadius = cameraRadiusTemp;
  document.getElementById("cameraRadius-value").innerHTML = cameraRadius;
  drawScene();
}

const updateProjectionMode = () => {
  projectionMode = document.getElementById("projection-type").value;
  drawScene();
};

const toggleShading = () => {
  shadingEnabled = !shadingEnabled;
  var text = shadingEnabled ? "On" : "Off";
  document.getElementById("shading-label").innerHTML = text;
  drawScene();
};

const toggleAnimation = () => {
  animationActive = !animationActive;
  var text = animationActive ? "On" : "Off";
  document.getElementById("animation-label").innerHTML = text;
  drawScene();
};

const rotateToX = () => {
  rotateAxis = 0;
};

const rotateToY = () => {
  rotateAxis = 1;
};

const rotateToZ = () => {
  rotateAxis = 2;
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
  gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttributeLocation);

  var normalBuffer = gl.createBuffer();
  var normal = getVectorNormals(vertice);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(normalLocation);

  gl.uniform1i(useLightingLocation, shadingEnabled);

  const indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
}

function loadObject() {
  let vertice = hollowObject.points;
  let vertexSorted = [];
  let colorSorted = [];
  // let normalSorted = [];
  for (let i = 0; i < hollowObject.rusuk.length; i++) {
    let point = hollowObject.rusuk[i];
    let tmpColor = [];
    let position = [];
    // let normal = [];
    for (let j = 0; j < point.topologi.length; j++) {
      position = position.concat(vertice[point.topologi[j][0]]);
      position = position.concat(vertice[point.topologi[j][1]]);
      position = position.concat(vertice[point.topologi[j][2]]);
      position = position.concat(vertice[point.topologi[j][3]]);
      tmpColor.push(point.color[j]);
      // normal = normal.concat(calculateNormalVector(vertice[point.topologi[j][0]], vertice[point.topologi[j][1]], vertice[point.topologi[j][2]]));
    }
    colorSorted.push(tmpColor);
    vertexSorted.push(position);
    // normalSorted.push(normal);
  }
  vertices = vertexSorted;
  colors = colorSorted;
  // normals = normalSorted;

  updateData();
  drawScene();
  // console.log(normals)
}


function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
  hollowObject = JSON.parse(event.target.result);
  loadObject();
}

document.getElementById("load").addEventListener("change", onChange);

function drawScene() {
  if (reqAnime) {
    cancelAnimationFrame(reqAnime);
  }
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a rectangle
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  for (let i = 0; i < vertices.length; i++) {
    var count = vertices[i].length / 2;
    render(vertices[i], colors[i]);
    var matrix = m4.identity();
    // var projectionMatrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);

    // var cameraMatrix = m4.yRotation(cameraAngleRadians);
    // cameraMatrix = m4.translate(cameraMatrix, 0, 0, cameraRadius * 1.5);
    // cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];

    // cameraMatrix = m4.lookAt(cameraPosition, cameraTarget, up);
    // var viewMatrix = m4.inverse(cameraMatrix);


    var cameraMatrix = m4.identity();
    var zoom = cameraRadius / 20;
    cameraMatrix = m4.lookAt(cameraPosition, cameraTarget, up, zoom);
    
    var viewMatrix = m4.inverse(cameraMatrix);
    // console.log(cameraMatrix)
    var projectionMatrix = m4.identity();
    // console.log(viewMatrix)


    if (projectionMode == "orthographic") {
      projectionMatrix = m4.orthographic(left, right, bottom, topFov, near, far);
    } else if (projectionMode == "perspective") {
      projectionMatrix = m4.perspective(fieldOfView, aspect, zNear, zFar);
    } else if (projectionMode == "oblique") {
      matrix = m4.oblique(left, right, bottom, topFov, near, far, 75, 85);
    }

    matrix = m4.translate(
      matrix,
      translation[0],
      translation[1],
      translation[2]
    );
    matrix = m4.xRotate(matrix, rotation[0]);
    matrix = m4.yRotate(matrix, rotation[1]);
    matrix = m4.zRotate(matrix, rotation[2]);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

    matrix = m4.multiply(viewMatrix, matrix);
    matrix = m4.multiply(projectionMatrix, matrix);
    // matrix = m4.multiply(projectionMatrix, matrix);

    var worldMatrix = matrix;
    var worldInverseMatrix = m4.inverse(worldMatrix);
    var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);


    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
    gl.uniform3fv(reverseLightDirectionLocation, normalize(lightDirection));
    gl.drawElements(this.gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
  }
  if (animationActive) {
    if (rotateAxis == 0) {
      if (rotateX == 360 ) {
        rotateX = 0;
      }
      rotateX+=1;
      rotation[0] = degToRad(rotateX);
    }
    else if (rotateAxis == 1) {
      if (rotateY == 360 ) {
        rotateY = 0;
      }
      rotateY+=1;
      rotation[1] = degToRad(rotateY);
    }
    else {
      if (rotateZ == 360 ) {
        rotateZ = 0;
      }
      rotateZ+=1;
      rotation[2] = degToRad(rotateZ);
    }
    reqAnime = requestAnimationFrame(drawScene);
}
}

function resetDefault() {
  rotation = [0, 0, 0];
  scale = [1, 1, 1];
  translation = [0, 0, 0];
  cameraPosition = [0, 0, 5];
  document.getElementById("angleX").value = 0;
  document.getElementById("angleY").value = 0;
  document.getElementById("angleZ").value = 0;
  document.getElementById("scaleX").value = 1;
  document.getElementById("scaleY").value = 1;
  document.getElementById("scaleZ").value = 1;
  document.getElementById("translateX").value = 0;
  document.getElementById("translateY").value = 0;
  document.getElementById("translateZ").value = 0;
  document.getElementById("cameraX").value = 0;
  document.getElementById("cameraY").value = 0;
  document.getElementById("cameraZ").value = 5;
  document.getElementById("cameraRadius").value = 20;
  document.getElementById("angleX-value").innerHTML = 0;
  document.getElementById("angleY-value").innerHTML = 0;
  document.getElementById("angleZ-value").innerHTML = 0;
  document.getElementById("scaleX-value").innerHTML = 1;
  document.getElementById("scaleY-value").innerHTML = 1;
  document.getElementById("scaleZ-value").innerHTML = 1;
  document.getElementById("translateX-value").innerHTML = 0;
  document.getElementById("translateY-value").innerHTML = 0;
  document.getElementById("translateZ-value").innerHTML = 0;
  document.getElementById("cameraX-value").innerHTML = 0;
  document.getElementById("cameraY-value").innerHTML = 0;
  document.getElementById("cameraZ-value").innerHTML = 5;
  document.getElementById("cameraRadius-value").innerHTML = 20;

  drawScene();
}

function updateData() {
  let data = hollowObject.slider
  document.getElementById("angleX").value = data[0];
  document.getElementById("angleY").value = data[1];
  document.getElementById("angleZ").value = data[2];
  document.getElementById("angleX-value").innerHTML = data[0];
  document.getElementById("angleY-value").innerHTML = data[1];
  document.getElementById("angleZ-value").innerHTML = data[2];
  rotation[0] = degToRad(data[0]);
  rotation[1] = degToRad(data[1]);
  rotation[2] = degToRad(data[2]);

  document.getElementById("translateX-value").innerHTML = data[3];
  document.getElementById("translateY-value").innerHTML = data[4];
  document.getElementById("translateZ-value").innerHTML = data[5];
  
  document.getElementById("translateX").value = data[3];
  document.getElementById("translateY").value = data[4];
  document.getElementById("translateZ").value = data[5];
  translation[0] = data[3];
  translation[1] = data[4];
  translation[2] = data[5];

  document.getElementById("scaleX").value = data[6]; 
  document.getElementById("scaleY").value = data[7];
  document.getElementById("scaleZ").value = data[8];
  document.getElementById("scaleX-value").innerHTML = data[6];
  document.getElementById("scaleY-value").innerHTML = data[7];
  document.getElementById("scaleZ-value").innerHTML = data[8];
  scale[0] = data[6];
  scale[1] = data[7];
  scale[2] = data[8];

  document.querySelector('#projection-type').value = hollowObject.projection;
  projectionMode = hollowObject.projection;

  rotateAxis = hollowObject.rotateAxis;

  shadingEnabled = hollowObject.shading;
  var textShading = shadingEnabled ? "On" : "Off";
  document.getElementById("shading-label").innerHTML = textShading;

  animationActive = hollowObject.animation;
  var textAnime = animationActive ? "On" : "Off";
  document.getElementById("shading-label").innerHTML = textAnime;
}

function saveModel() {
  let rx, ry, rz;
  rx = document.getElementById("angleX").value;
  ry = document.getElementById("angleY").value;
  rz = document.getElementById("angleZ").value;
  hollowObject.slider = [rx, ry, rz, translation[0], translation[1], translation[2], scale[0], scale[1], scale[2]];
  hollowObject.projection = projectionMode;
  hollowObject.rotateAxis = rotateAxis;
  hollowObject.shading = shadingEnabled;
  hollowObject.animation = animationActive;

  let data = JSON.stringify(hollowObject);
  download("model.json", 'text/plain', data);
}

function download(fileName, contentType, content) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
loadObject();
