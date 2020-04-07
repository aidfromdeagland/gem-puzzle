import shuffle from './utils.js';


class GemPuzzle {
  init(size = 4) {
    this.size = size;
    this.cells = [];
    for (let i = 0; i < this.size ** 2; i += 1) {
      this.cells.push(i);
    }
    /*this.cells = shuffle(this.cells);*/
    this.moves = 0;

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
    const menu = document.createElement('div');
    menu.classList.add('menu');
    menu.innerHTML = '<button class="menu__button menu__button_save">save</button>'
      + '<div class="menu__new-game"><button class="menu__button menu__button_restart">retry</button>'
      + '<button class="menu__button menu__button_start3">3x3</button><button class="menu__button menu__button_start4">4x4</button>'
      + '<button class="menu__button menu__button_start5">5x5</button><button class="menu__button menu__button_start6">6x6</button>'
      + '<button class="menu__button menu__button_start7">7x7</button><button class="menu__button menu__button_start8">8x8</button>'
      + '</div>'
      + '<button class="menu__button menu__button_results">results</button>';
    wrapper.appendChild(menu);
    document.body.appendChild(wrapper);
    field.appendChild(this.drawCells());
    const cellsCollection = document.querySelectorAll('.field__cell');
    field.addEventListener('mousedown', (evt) => {

      const targetIndex = this.cells.indexOf(+evt.target.dataset.number);
      const zeroIndex = this.cells.indexOf(0);

      const swapCells = () => {
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
        this.movesCount();

        if (this.checkWin()) {
          const passedTime = new Date(new Date() - this.startTime);
          alert(`Congrats! You solved this puzzle in ${passedTime.getUTCMinutes()} minutes, ${passedTime.getUTCSeconds()} seconds and ${this.moves} moves`);
          this.redraw(this.size);
        }
      };

      if (evt.target.classList.contains('field__cell')
        && evt.button === 0
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

        const mouseUpHandler = function () {
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
          document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      }
    });

    menu.addEventListener('click', (evt) => {
      switch (evt.target) {
        case document.querySelector('.menu__button_save'):
          console.log('SAVE');
          break;
        case document.querySelector('.menu__button_results'):
          console.log('RESULTS');
          break;
        case document.querySelector('.menu__button_restart'):
          this.redraw(this.size);
          break;
        case document.querySelector('.menu__button_start3'):
          this.redraw(3);
          break;
        case document.querySelector('.menu__button_start4'):
          this.redraw(4);
          break;
        case document.querySelector('.menu__button_start5'):
          this.redraw(5);
          break;
        case document.querySelector('.menu__button_start6'):
          this.redraw(6);
          break;
        case document.querySelector('.menu__button_start7'):
          this.redraw(7);
          break;
        case document.querySelector('.menu__button_start8'):
          this.redraw(8);
          break;
        default:
          break;
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

  redraw(size) {
    document.body.removeChild(document.querySelector('.wrapper'));
    this.init(size);
  }

  checkWin() {
    for (let i = 0; i < this.cells.length - 1; i += 1) {
      if (this.cells[i] !== this.cells[i + 1] - 1) return false;
    }
    return true;
  }
}

export default GemPuzzle;
