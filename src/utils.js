const shuffle = function (array) {
  let m = array.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

function getMatrix(size) {
  const fieldMatrix = new Array(size);
  for (let i = 0; i < fieldMatrix.length; i++) {
    fieldMatrix[i] = new Array(size);
    for (let j = 0; j < fieldMatrix[i].length; j++) {
      fieldMatrix[i][j] = i * size + j + 1;
    }
  }
  fieldMatrix[size - 1][size - 1] = 0;
  return fieldMatrix;
}
