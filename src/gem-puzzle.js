import { shuffle } from './utils.js';


class GemPuzzle {
  constructor() {
    this.size = 4;
  }

  init() {
    this.cells = [];
    for (let i = 0; i < this.size ** 2; i += 1) {
      this.cells.push(i);
    }
    this.cells = shuffle(this.cells);

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    const field = document.createElement('div');
    field.classList.add('field');
    field.classList.add(`field_size_${this.size}`);
    wrapper.appendChild(field);
    document.body.appendChild(wrapper);
    field.appendChild(this.drawCells());
    const cellsCollection = document.querySelectorAll('.field__cell');
    field.addEventListener('click', (evt) => {
      const targetIndex = this.cells.indexOf(+evt.target.dataset.number);
      const zeroIndex = this.cells.indexOf(0);
      if (evt.target.classList.contains('field__cell')
        && ((targetIndex === zeroIndex + 1
          && Math.floor(targetIndex / this.size) === Math.floor(zeroIndex / this.size))
        || (targetIndex === zeroIndex - 1
            && Math.floor(targetIndex / this.size) === Math.floor(zeroIndex / this.size))
        || targetIndex === zeroIndex + this.size
        || targetIndex === zeroIndex - this.size)
      ) {
        const tempValue = cellsCollection[targetIndex].dataset.number;
        const tempClass = cellsCollection[targetIndex].className;

        cellsCollection[targetIndex].dataset.number = cellsCollection[zeroIndex].dataset.number;
        cellsCollection[targetIndex].textContent = cellsCollection[zeroIndex].textContent;
        cellsCollection[targetIndex].className = cellsCollection[zeroIndex].className;

        cellsCollection[zeroIndex].dataset.number = tempValue;
        cellsCollection[zeroIndex].textContent = tempValue;
        cellsCollection[zeroIndex].className = tempClass;

        const temp = this.cells[targetIndex];
        this.cells[targetIndex] = this.cells[zeroIndex];
        this.cells[zeroIndex] = temp;

        if (this.checkWin()) {
          console.log('pobeda');
        }
      }
    });
  }

  drawCells() {
    const fragment = document.createDocumentFragment();
    this.cells.forEach((x) => {
      const cell = document.createElement('div');
      cell.dataset.number = x.toString();
      cell.textContent = x.toString();
      cell.classList.add('field__cell', `field__cell_${x}`);
      fragment.appendChild(cell);
    });
    return fragment;
  }

  redraw() {
    document.body.removeChild(document.querySelector('.wrapper'));
    this.init();
  }

  checkWin() {
    for (let i = 0; i < this.cells.length - 1; i += 1) {
      if (this.cells[i] !== this.cells[i + 1] - 1) return false;
    }
    return true;
  }
}

export default GemPuzzle;
