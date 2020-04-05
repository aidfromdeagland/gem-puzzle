import {shuffle,getMatrix} from './utils.js';


class GemPuzzle {
  constructor(size = 4) {
    this.size = size;
  }

  init() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    const field = document.createElement('div');
    field.classList.add('field');
    field.classList.add(`field_size_${this.size}`);
    field.appendChild(this.getCells());
    wrapper.appendChild(field);
    document.body.appendChild(wrapper);
  }

  getCells() {
    const result = [];
    for (let i = 0; i < this.size ** 2; i += 1) {
      result.push(i);
    }

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < result.length; i += 1) {
      const cell = document.createElement('div');
      cell.dataset.number = i.toString();
      cell.textContent = i.toString();
      cell.classList.add('field__cell', `field__cell_${i}`);
      fragment.appendChild(cell);
    }
    return fragment;
  }
}

export default GemPuzzle;
