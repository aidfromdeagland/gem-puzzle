import GemPuzzle from './src/gem-puzzle.js';

window.addEventListener('load', () => {
  alert('Use "easy" button to check win / leaderbord scripts without cells shuffling');
  const gemPuzzle = new GemPuzzle();
  gemPuzzle.init();
});
