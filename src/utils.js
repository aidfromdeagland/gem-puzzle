function shuffle(array) {
  const arrCopy = array.slice();
  let m = array.length;
  let t;
  let i;

  while (m) {
    i = Math.floor(Math.random() * (m += 1));
    t = arrCopy[m];
    arrCopy[m] = arrCopy[i];
    arrCopy[i] = t;
  }
  return arrCopy;
}

function getMatrix(size) {
  const fieldMatrix = new Array(size);
  for (let i = 0; i < fieldMatrix.length; i += 1) {
    fieldMatrix[i] = new Array(size);
    for (let j = 0; j < fieldMatrix[i].length; j += 1) {
      fieldMatrix[i][j] = i * size + j + 1;
    }
  }
  fieldMatrix[size - 1][size - 1] = 0;
  return fieldMatrix;
}

export { getMatrix };
export { shuffle };
