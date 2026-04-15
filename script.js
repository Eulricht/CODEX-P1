const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetButton = document.getElementById("reset");
const playerXCard = document.getElementById("card-x");
const playerOCard = document.getElementById("card-o");
const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");
const scoreDrawElement = document.getElementById("score-draw");
const moveCountElement = document.getElementById("move-count");
const streakLabelElement = document.getElementById("streak-label");
const roundLabelElement = document.getElementById("round-label");
const turnLabelElement = document.getElementById("turn-label");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let boardState = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let winningCells = [];
let lastMoveIndex = null;
let roundNumber = 1;
let scores = {
  X: 0,
  O: 0,
  draw: 0
};
let streak = {
  player: "",
  count: 0
};

function createBoard() {
  boardElement.innerHTML = "";

  boardState.forEach((value, index) => {
    const button = document.createElement("button");
    button.className = "cell";
    button.type = "button";
    button.dataset.index = index;
    button.textContent = value;
    button.disabled = Boolean(value) || gameOver;

    if (value) {
      button.classList.add(value.toLowerCase());
    }

    if (winningCells.includes(index)) {
      button.classList.add("win");
    }

    if (lastMoveIndex === index) {
      button.classList.add("last-move");
    }

    button.addEventListener("click", handleMove);
    boardElement.appendChild(button);
  });

  updateActivePlayerCard();
  updateHud();
}

function handleMove(event) {
  const index = Number(event.currentTarget.dataset.index);

  if (boardState[index] || gameOver) {
    return;
  }

  boardState[index] = currentPlayer;
  lastMoveIndex = index;

  const winner = getWinner();
  if (winner) {
    gameOver = true;
    winningCells = winner.line;
    scores[winner.player] += 1;
    updateStreak(winner.player);
    statusElement.textContent = `Player ${winner.player} wins`;
    turnLabelElement.textContent = "Round complete";
  } else if (boardState.every(Boolean)) {
    gameOver = true;
    scores.draw += 1;
    streak.player = "";
    streak.count = 0;
    statusElement.textContent = "Draw game";
    turnLabelElement.textContent = "Board locked";
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
    turnLabelElement.textContent = `${boardState.filter(Boolean).length} moves played`;
  }

  createBoard();
}

function getWinner() {
  for (const [a, b, c] of winningLines) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return {
        player: boardState[a],
        line: [a, b, c]
      };
    }
  }

  return null;
}

function updateActivePlayerCard() {
  playerXCard.classList.toggle("is-active", !gameOver && currentPlayer === "X");
  playerOCard.classList.toggle("is-active", !gameOver && currentPlayer === "O");
}

function updateHud() {
  const movesPlayed = boardState.filter(Boolean).length;

  scoreXElement.textContent = String(scores.X);
  scoreOElement.textContent = String(scores.O);
  scoreDrawElement.textContent = String(scores.draw);
  moveCountElement.textContent = String(movesPlayed);
  roundLabelElement.textContent = `Round ${roundNumber}`;
  streakLabelElement.textContent = streak.count > 1 ? `${streak.player} x${streak.count}` : "None";

  if (!gameOver && movesPlayed === 0) {
    turnLabelElement.textContent = "Opening move";
  }
}

function updateStreak(player) {
  if (streak.player === player) {
    streak.count += 1;
    return;
  }

  streak.player = player;
  streak.count = 1;
}

function resetGame() {
  boardState = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  winningCells = [];
  lastMoveIndex = null;
  roundNumber += 1;
  statusElement.textContent = "Player X's turn";
  turnLabelElement.textContent = "Opening move";
  createBoard();
}

resetButton.addEventListener("click", resetGame);
createBoard();
