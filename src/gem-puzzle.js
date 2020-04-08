import shuffle from './utils.js';


class GemPuzzle {
  init(size = 4, cells = [], moves = 0, startTime = new Date()) {
    this.size = size;
    this.cells = cells;

    if (!cells.length) {
      for (let i = 0; i < this.size ** 2; i += 1) {
        this.cells.push(i);
      }

      if (!this.easyMode) this.cells = shuffle(this.cells);
    }

    this.easyMode = false;
    this.moves = moves;
    this.startTime = startTime;

    if (localStorage.getItem('leaders')) {
      this.leaders = JSON.parse(localStorage.getItem('leaders'));
    } else {
      this.leaders = [
        {name: 'God', result: 1}, {name: 'Flash', result: 2}, {name: 'A. Einstein', result: 3}, {
          name: 'M. Schumacher',
          result: 4,
        }, {name: 'HOCKEY', result: 68}, {name: 'TRACTOR', result: 162}, {name: 'SAUNA', result: 289}, {
          name: '50 GRAM',
          result: 1440,
        }, {name: 'Chay s malinovym vareniem', result: 4200}, {name: 'Slowpoke', result: 9999},
      ];
      localStorage.setItem('leaders', JSON.stringify(this.leaders));
    }


    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    const info = document.createElement('div');
    info.classList.add('info');
    info.innerHTML = '<p class="info__timing">time<span class="info__duration">00 : 00</span></p>'
      + `<p class="info__counter">moves<span class="info__moves">${this.moves}</span></p>`;
    wrapper.appendChild(info);
    const field = document.createElement('div');
    field.classList.add('field');
    field.classList.add(`field_size_${this.size}`);
    wrapper.appendChild(field);
    const menu = document.createElement('div');
    menu.classList.add('menu');
    menu.innerHTML = '<div class="menu__saveload"><button class="menu__button menu__button_save">save</button>'
      + '<button class="menu__button menu__button_load">load</button></div>'
      + '<div class="menu__new-game"><button class="menu__button menu__button_restart">retry</button><button class="menu__button menu__button_easyMode">easy</button>'
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
          const passedTime = Math.floor(new Date(new Date() - this.startTime).getTime() / 1000);
          alert(`Congrats! You solved this puzzle in ${Math.floor(passedTime / 60)} minutes, ${Math.floor(passedTime % 60)} seconds and ${this.moves} moves`);
          if (Math.floor(passedTime) < this.leaders[9].result) {
            const newLeader = prompt('You hit the leaderboard! Please, enter your name', 'Mr. Champion');
            if (newLeader.length > 0) {
              const leaderToAdd = {name: newLeader, result: passedTime};
              this.leaders.push(leaderToAdd);
              this.leaders.sort((a, b) => a.result - b.result);
              this.leaders = this.leaders.slice(0, 10);
              localStorage.removeItem('leaders');
              localStorage.setItem('leaders', JSON.stringify(this.leaders));
            }
          }
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
          localStorage.setItem('savedGame', JSON.stringify({
            size: this.size,
            time: new Date((new Date() - this.startTime)),
            moves: this.moves,
            matrix: this.cells.slice(),
          }));
          break;
        case document.querySelector('.menu__button_load'):
          if (localStorage.getItem('savedGame')) {
            const quest = confirm('Would uou like to load last saved game?');
            if (quest) {
              const savedGame = JSON.parse(localStorage.getItem('savedGame'));
              const savedDate = new Date(new Date() - new Date(savedGame.time));
              this.redraw(savedGame.size, savedGame.matrix, savedGame.moves, savedDate);
            }
          } else {
            alert('Sorry, there is no any saved game');
          }
          break;
        case document.querySelector('.menu__button_results'):
          let alertString = '';
          for (let i = 0; i < this.leaders.length; i += 1) {
            alertString += `${i + 1}) ${Math.floor(this.leaders[i].result / 60)} : ${Math.floor(this.leaders[i].result % 60)}  - ${this.leaders[i].name} \n`;
          }
          alert(alertString);
          break;
        case document.querySelector('.menu__button_restart'):
          this.redraw(this.size);
          break;
        case document.querySelector('.menu__button_easyMode'):
          this.easyMode = true;
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

    this.timer();
  }

  timer() {
    const gameDuration = document.querySelector('.info__duration');
    setInterval(() => {
      const timePassed = new Date((new Date() - this.startTime));
      gameDuration.textContent = `${timePassed.getUTCMinutes() < 10
        ? `0${timePassed.getUTCMinutes()}`
        : timePassed.getUTCMinutes()} : ${timePassed.getUTCSeconds() < 10
        ? `0${timePassed.getUTCSeconds()}`
        : timePassed.getUTCSeconds()}`;
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

  redraw(size, cells, moves, startTime) {
    document.body.removeChild(document.querySelector('.wrapper'));
    this.init(size, cells, moves, startTime);
  }

  checkWin() {
    for (let i = 0; i < this.cells.length - 1; i += 1) {
      if (this.cells[i] !== this.cells[i + 1] - 1) return false;
    }
    return true;
  }
}

export default GemPuzzle;
