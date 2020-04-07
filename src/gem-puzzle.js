import shuffle from './utils.js';


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
    this.moves = 0;

    const self = this;

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    const info = document.createElement('div');
    info.classList.add('info');
    info.innerHTML = '<p class="info__timing">time<span class="info__duration">0 : 0 : 0</span></p>'
      + '<p class="info__counter">moves<span class="info__moves"> 0</span></p>';
    wrapper.appendChild(info);
    const field = document.createElement('div');
    field.classList.add('field');
    field.classList.add(`field_size_${this.size}`);
    wrapper.appendChild(field);
    document.body.appendChild(wrapper);
    field.appendChild(this.drawCells());
    const cellsCollection = document.querySelectorAll('.field__cell');
    const gameMoves = document.querySelector('info__moves');
    field.addEventListener('mousedown', (evt) => {
      const targetIndex = this.cells.indexOf(+evt.target.dataset.number);
      const zeroIndex = this.cells.indexOf(0);

      const swapCells = function() {
        const tempValue = cellsCollection[targetIndex].dataset.number;
        const tempClass = cellsCollection[targetIndex].className;

        cellsCollection[targetIndex].dataset.number = cellsCollection[zeroIndex].dataset.number;
        cellsCollection[targetIndex].textContent = cellsCollection[zeroIndex].textContent;
        cellsCollection[targetIndex].className = cellsCollection[zeroIndex].className;

        cellsCollection[zeroIndex].dataset.number = tempValue;
        cellsCollection[zeroIndex].textContent = tempValue;
        cellsCollection[zeroIndex].className = tempClass;

        const temp = self.cells[targetIndex];
        self.cells[targetIndex] = self.cells[zeroIndex];
        self.cells[zeroIndex] = temp;
        self.movesCount();

        if (self.checkWin()) {
          console.log('pobeda');
        }
      };

      if (evt.target.classList.contains('field__cell')
        && ((targetIndex === zeroIndex + 1
          && Math.floor(targetIndex / this.size) === Math.floor(zeroIndex / this.size))
        || (targetIndex === zeroIndex - 1
            && Math.floor(targetIndex / this.size) === Math.floor(zeroIndex / this.size))
        || targetIndex === zeroIndex + this.size
        || targetIndex === zeroIndex - this.size)
      ) {
        const zeroCellInfo = cellsCollection[zeroIndex].getBoundingClientRect();
        evt.target.classList.add('field__cell_draggable');
        evt.target.style.left = `${0}px`;
        evt.target.style.top = `${0}px`;

        const mouseMoveHandler = function (moveEvt) {
          moveEvt.preventDefault();

          evt.target.style.left = `${+evt.target.style.left.slice(0, -2) + moveEvt.movementX}px`;
          evt.target.style.top = `${+evt.target.style.top.slice(0, -2) + moveEvt.movementY}px`;

          const targetCellInfo = cellsCollection[targetIndex].getBoundingClientRect();
          const targetCellCenter = {
            x: (targetCellInfo.left + targetCellInfo.right) / 2,
            y: (targetCellInfo.top + targetCellInfo.bottom) / 2,
          };

          if (targetCellCenter.x > zeroCellInfo.left && targetCellCenter.x < zeroCellInfo.right
          && targetCellCenter.y > zeroCellInfo.top && targetCellCenter.y < zeroCellInfo.bottom) {
            if (!cellsCollection[zeroIndex].classList.contains('field__cell_dropbox')) {
              cellsCollection[zeroIndex].classList.add('field__cell_dropbox');
            }
          } else if (cellsCollection[zeroIndex].classList.contains('field__cell_dropbox')) {
            cellsCollection[zeroIndex].classList.remove('field__cell_dropbox');
          }
        };

        const mouseUpHanler = function () {

          if (cellsCollection[zeroIndex].classList.contains('field__cell_dropbox')) {
            cellsCollection[zeroIndex].classList.remove('field__cell_dropbox');
          }

          const targetCellInfo = cellsCollection[targetIndex].getBoundingClientRect();
          const targetCellCenter = {
            x: (targetCellInfo.left + targetCellInfo.right) / 2,
            y: (targetCellInfo.top + targetCellInfo.bottom) / 2,
          };

          if (
            (targetCellCenter.x > zeroCellInfo.left && targetCellCenter.x < zeroCellInfo.right
            && targetCellCenter.y > zeroCellInfo.top && targetCellCenter.y < zeroCellInfo.bottom)
          || (Math.abs(+evt.target.style.left.slice(0, -2)) < 10
            && Math.abs(+evt.target.style.top.slice(0, -2)) < 10)
          ) {
            evt.target.classList.remove('field__cell_draggable');
            evt.target.style.left = '';
            evt.target.style.top = '';
            swapCells();
          } else {
            evt.target.classList.remove('field__cell_draggable');
            evt.target.style.left = '';
            evt.target.style.top = '';
          }

          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHanler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHanler);
      }
    });

    this.startTime = new Date();
    this.timer();
  }

  timer() {
    const gameDuration = document.querySelector('.info__duration');
    const timerId = setInterval(() => {
      const timePassed = new Date((new Date() - this.startTime));
      gameDuration.textContent = `${timePassed.getUTCHours()} : ${timePassed.getUTCMinutes()} : ${timePassed.getUTCSeconds()}`;
    }, 1000);
  }

  movesCount() {
    const gameMoves = document.querySelector('.info__moves');
    this.moves += 1;
    gameMoves.textContent = `${this.moves}`;
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
