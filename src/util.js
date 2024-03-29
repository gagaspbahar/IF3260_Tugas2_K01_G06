function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
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

function calculateNormalVector(v0, v1, v2) {
  const u = subtractVectors(v1, v0);
  const v = subtractVectors(v2, v0);
  const normal = cross(u, v);
  const normalized = normalize(normal);
  return normalized;
}

function getVectorNormals(position) {
  const n = position.length;
  var normals = [];
  for (let i = 0; i < n; i += 12){
    const p1 = position.slice(i, i+3);
    const p2 = position.slice(i+3, i+6);
    const p3 = position.slice(i+6, i+9);
    const vec1 = subtractVectors(p2, p1);
    const vec2 = subtractVectors(p3, p1);
    const normalDirection = cross(vec1, vec2);
    const vecNormal  = normalize(normalDirection);
    normals.push(...vecNormal, ...vecNormal, ...vecNormal, ...vecNormal);
  }
  return normals;
}

const defaultObject = {
  "points":[
      [-5,-4,-4],
      [-4,-4,-4],
      [-4,4,-4],
      [-5,4,-4],
      [-4,4,-5],
      [-4,4,-4],
      [-4,-4,-4],
      [-4,-4,-5],
      [-5,-5,-5],
      [-5,-4,-4],
      [-5,4,-4],
      [-5,5,-5],
      [-5,5,-5],
      [-4,4,-5],
      [-4,-4,-5],
      [-5,-5,-5],
      [5,4,-4],
      [4,4,-4],
      [4,-4,-4],
      [5,-4,-4],
      [4,-4,-5],
      [4,-4,-4],
      [4,4,-4],
      [4,4,-5],
      [5,5,-5],
      [5,4,-4],
      [5,-4,-4],
      [5,-5,-5],
      [5,-5,-5],
      [4,-4,-5],
      [4,4,-5],
      [5,5,-5],
      [-5,4,4],
      [-4,4,4],
      [-4,-4,4],
      [-5,-4,4],
      [-4,-4,5],
      [-4,-4,4],
      [-4,4,4],
      [-4,4,5],
      [-5,5,5],
      [-5,4,4],
      [-5,-4,4],
      [-5,-5,5],
      [-5,-5,5],
      [-4,-4,5],
      [-4,4,5],
      [-5,5,5],
      [5,-4,4],
      [4,-4,4],
      [4,4,4],
      [5,4,4],
      [4,4,5],
      [4,4,4],
      [4,-4,4],
      [4,-4,5],
      [5,-5,5],
      [5,-4,4],
      [5,4,4],
      [5,5,5],
      [5,5,5],
      [4,4,5],
      [4,-4,5],
      [5,-5,5],
      [4,-5,-4],
      [4,-4,-4],
      [-4,-4,-4],
      [-4,-5,-4],
      [-4,-4,-5],
      [-4,-4,-4],
      [4,-4,-4],
      [4,-4,-5],
      [5,-5,-5],
      [4,-5,-4],
      [-4,-5,-4],
      [-5,-5,-5],
      [-5,-5,-5],
      [-4,-4,-5],
      [4,-4,-5],
      [5,-5,-5],
      [-4,5,-4],
      [-4,4,-4],
      [4,4,-4],
      [4,5,-4],
      [4,4,-5],
      [4,4,-4],
      [-4,4,-4],
      [-4,4,-5],
      [-5,5,-5],
      [-4,5,-4],
      [4,5,-4],
      [5,5,-5],
      [5,5,-5],
      [4,4,-5],
      [-4,4,-5],
      [-5,5,-5],
      [-4,-5,4],
      [-4,-4,4],
      [4,-4,4],
      [4,-5,4],
      [4,-4,5],
      [4,-4,4],
      [-4,-4,4],
      [-4,-4,5],
      [-5,-5,5],
      [-4,-5,4],
      [4,-5,4],
      [5,-5,5],
      [5,-5,5],
      [4,-4,5],
      [-4,-4,5],
      [-5,-5,5],
      [4,5,4],
      [4,4,4],
      [-4,4,4],
      [-4,5,4],
      [-4,4,5],
      [-4,4,4],
      [4,4,4],
      [4,4,5],
      [5,5,5],
      [4,5,4],
      [-4,5,4],
      [-5,5,5],
      [-5,5,5],
      [-4,4,5],
      [4,4,5],
      [5,5,5],
      [-5,4,-4],
      [-4,4,-4],
      [-4,4,4],
      [-5,4,4],
      [-4,5,4],
      [-4,4,4],
      [-4,4,-4],
      [-4,5,-4],
      [-5,5,-5],
      [-5,4,-4],
      [-5,4,4],
      [-5,5,5],
      [-5,5,5],
      [-4,5,4],
      [-4,5,-4],
      [-5,5,-5],
      [5,4,4],
      [4,4,4],
      [4,4,-4],
      [5,4,-4],
      [4,5,-4],
      [4,4,-4],
      [4,4,4],
      [4,5,4],
      [5,5,5],
      [5,4,4],
      [5,4,-4],
      [5,5,-5],
      [5,5,-5],
      [4,5,-4],
      [4,5,4],
      [5,5,5],
      [-5,-4,4],
      [-4,-4,4],
      [-4,-4,-4],
      [-5,-4,-4],
      [-4,-5,-4],
      [-4,-4,-4],
      [-4,-4,4],
      [-4,-5,4],
      [-5,-5,5],
      [-5,-4,4],
      [-5,-4,-4],
      [-5,-5,-5],
      [-5,-5,-5],
      [-4,-5,-4],
      [-4,-5,4],
      [-5,-5,5],
      [5,-4,-4],
      [4,-4,-4],
      [4,-4,4],
      [5,-4,4],
      [4,-5,4],
      [4,-4,4],
      [4,-4,-4],
      [4,-5,-4],
      [5,-5,-5],
      [5,-4,-4],
      [5,-4,4],
      [5,-5,5],
      [5,-5,5],
      [4,-5,4],
      [4,-5,-4],
      [5,-5,-5]
  ],
  "edge":[
      {
          "topology":[
              [0,1,2,3],
              [4,5,6,7],
              [8,9,10,11],
              [12,13,14,15]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [16,17,18,19],
              [20,21,22,23],
              [24,25,26,27],
              [28,29,30,31]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [32,33,34,35],
              [36,37,38,39],
              [40,41,42,43],
              [44,45,46,47]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [48,49,50,51],
              [52,53,54,55],
              [56,57,58,59],
              [60,61,62,63]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [64,65,66,67],
              [68,69,70,71],
              [72,73,74,75],
              [76,77,78,79]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [80,81,82,83],
              [84,85,86,87],
              [88,89,90,91],
              [92,93,94,95]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [96,97,98,99],
              [100,101,102,103],
              [104,105,106,107],
              [108,109,110,111]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [112,113,114,115],
              [116,117,118,119],
              [120,121,122,123],
              [124,125,126,127]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [128,129,130,131],
              [132,133,134,135],
              [136,137,138,139],
              [140,141,142,143]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [144,145,146,147],
              [148,149,150,151],
              [152,153,154,155],
              [156,157,158,159]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [160,161,162,163],
              [164,165,166,167],
              [168,169,170,171],
              [172,173,174,175]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      },
      {
          "topology":[
              [176,177,178,179],
              [180,181,182,183],
              [184,185,186,187],
              [188,189,190,191]
          ],
          "color":[
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1],
              [1,0.6,0.9,1]
          ]
      }
  ]
}

// indices for the 6 faces of a cube
// prettier-ignore
const defaultIndices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23,   // left
];

function matrixMultiplication(matrixA, matrixB) {
    const result = [];
    for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixB[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < matrixA[0].length; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function rotationObject(object, rotateX, rotateY, rotateZ, centerPositionX, centerPositionY, centerPositionZ, scaleX, scaleY, scaleZ, translateX, translateY, translateZ) {
    let matrixResult = [], mTmp = [];
    var matrix = m4.identity();
    matrix = m4.translate(matrix, translateX, translateY, translateZ);
    matrix = m4.scale(matrix, scaleX, scaleY, scaleZ);
    matrix = m4.translate(matrix, centerPositionX, centerPositionY, centerPositionZ);
    matrix = m4.xyzRotate(matrix, rotateX, rotateY, rotateZ);
    matrix = m4.translate(matrix, -centerPositionX, -centerPositionY, -centerPositionZ);
    for (let i = 0; i < matrix.length; i++) {
        mTmp.push(matrix[i]);
        if (mTmp.length == 4) {
            matrixResult.push(mTmp);
            mTmp = [];
        }
    }
    for (let i = 0; i < object.points.length; i++) {
        let point = object.points[i];
        let matrixObject = [[point[0], point[1], point[2], 1]];
        let result = matrixMultiplication(matrixObject, matrixResult);
        object.points[i] = [result[0][0], result[0][1], result[0][2]];
    }
}

function scaleObject(object, scaleX, scaleY, scaleZ, centerPositionX, centerPositionY, centerPositionZ) {
    let matrixResult = [], mTmp = [];
    let matrix = m4.identity();
    matrix = m4.translate(matrix, centerPositionX, centerPositionY, centerPositionZ);
    
    matrix = m4.translate(matrix, -centerPositionX, -centerPositionY, -centerPositionZ);
    for (let i = 0; i < matrix.length; i++) {
        mTmp.push(matrix[i]);
        if (mTmp.length == 4) {
            matrixResult.push(mTmp);
            mTmp = [];
        }
    }
    for (let i = 0; i < object.points.length; i++) {
        let point = object.points[i];
        let matrixObject = [[point[0], point[1], point[2], 1]];
        let result = matrixMultiplication(matrixObject, matrixResult);
        object.points[i] = [result[0][0], result[0][1], result[0][2]];

    }
}

function translationObject(object, positionX, positionY, positionZ) {
    for (let i = 0; i < object.points.length; i++) {
        object.points[i] = [
            object.points[i][0] + positionX,
            object.points[i][1] + positionY,
            object.points[i][2] + positionZ,
        ];
    }
}