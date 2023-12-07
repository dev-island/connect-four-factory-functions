// Constants
const ROWS = 6;
const COLS = 7;
let board = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null));
let isGameActive = false;

// Selectors
const template = document.getElementById('game-cell');
const gameBoard = document.getElementById('game-board');
const gameStatus = document.getElementById('game-status');
const btn = document.getElementById('game-btn');

// Create Player Factory Function
const createPlayer = (playerName, playerColor) => {
  const name = playerName;
  const color = playerColor;

  const getName = () => name;
  const getColor = () => color;

  return { getName, getColor };
};

// Create Game Factory Function
const createGame = (player1, player2) => {
  let currentPlayer = player1;

  const togglePlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkForTie = () => {
    if (board.every((row) => row.every((cell) => cell))) {
      updateGameStatus('The game ends in a draw');
      isGameActive = false;
    }
  };

  const checkForWin = (row, col) => {
    // Check for horizontal
    for (let i = 0; i < ROWS - 3; i++) {
      if (
        board[row][i] === currentPlayer &&
        board[row][i + 1] === currentPlayer &&
        board[row][i + 2] === currentPlayer &&
        board[row][i + 3] === currentPlayer
      ) {
        updateGameStatus(`${currentPlayer.getName()} wins horizontally!`);
        isGameActive = false;
        return;
      }
    }
    // check for vertical
    for (let i = 0; i < COLS - 4; i++) {
      if (
        board[i][col] === currentPlayer &&
        board[i + 1][col] === currentPlayer &&
        board[i + 2][col] === currentPlayer &&
        board[i + 3][col] === currentPlayer
      ) {
        updateGameStatus(`${currentPlayer.getName()} wins vertically!`);
        isGameActive = false;
        return;
      }
    }
    // check for diagonal upwards to the right
    // check for diagonal downwards to the right
  };

  const handleCellClick = (row, col) => {
    const cell = board[row][col];
    if (cell !== null || !isGameActive) return;

    for (let i = ROWS - 1; i > -1; i--) {
      if (!board[i][col]) {
        board[i][col] = currentPlayer;
        const disc = document.getElementById(`cell-${i}-${col}`);
        disc.classList.remove('bg-gray-300');
        disc.classList.add(currentPlayer.getColor());
        checkForWin(i, col);
        checkForTie();
        togglePlayer();
        updateGameStatus(`${currentPlayer.getName()}'s turn`);
        return;
      }
    }
  };

  const resetGame = (game) => {
    board = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null));
    currentPlayer = player1;
    isGameActive = true;
    updateGameStatus(`${currentPlayer.getName()}'s turn`);

    gameBoard.innerText = '';
    createBoard(game);
  };

  const updateGameStatus = (message) => {
    if (!isGameActive) return;
    gameStatus.innerText = message;
  };

  return { handleCellClick, resetGame };
};

// Create Board Function
const createBoard = (game) => {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const cell = template.content.cloneNode(true).querySelector('div');
      cell.id = `cell-${i}-${j}`;
      cell.addEventListener('click', () => {
        game.handleCellClick(i, j);
      });
      gameBoard.appendChild(cell);
    }
  }
};

(function () {
  const player1 = createPlayer('Bob', 'bg-pink-500');
  const player2 = createPlayer('Martha', 'bg-green-500');

  const game = createGame(player1, player2);
  createBoard(game);
  isGameActive = true;

  btn.addEventListener('click', () => {
    game.resetGame(game);
  });
})();
