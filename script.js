const totalCells = 30;
const boardEl = document.getElementById("board");
const diceResultEl = document.getElementById("diceResult");
const turnIndicatorEl = document.getElementById("turnIndicator");
const gameMessageEl = document.getElementById("gameMessage");
const player1StatusEl = document.getElementById("player1Status");
const player2StatusEl = document.getElementById("player2Status");
const rollButton = document.getElementById("rollButton");

const playerPositions = [1, 1];
let currentPlayer = 0;
let gameOver = false;

const animalScenes = [
  "אריה",
  "פיל",
  "ג'ירפה",
  "זברה",
  "שועל",
  "פנדה",
  "קואלה",
  "דוב",
  "כלב ים",
  "טווס",
  "נמר",
  "דולפין",
  "צפרדע",
  "ינשוף",
  "פרפר",
  "חמור בר",
  "קיפוד",
  "ארנב",
  "לוטרה",
  "סנאי",
  "חתול",
  "כלב",
  "סוס",
  "גמל",
  "תוכי",
  "כריש",
  "פינגווין",
  "פלמינגו",
  "צב",
  "זאב"
];

function watercolorBackground(seed, hueShift) {
  return `radial-gradient(circle at ${20 + (seed * 17) % 60}% ${20 + (seed * 11) % 60}%, hsla(${hueShift}, 75%, 83%, 0.85), transparent 60%),
          radial-gradient(circle at ${70 - (seed * 13) % 45}% ${60 - (seed * 7) % 40}%, hsla(${(hueShift + 40) % 360}, 70%, 78%, 0.8), transparent 56%),
          linear-gradient(160deg, hsla(${(hueShift + 90) % 360}, 68%, 88%, 0.95), hsla(${(hueShift + 160) % 360}, 60%, 86%, 0.92))`;
}

function boardOrder(index) {
  const row = Math.floor((index - 1) / 10);
  const col = (index - 1) % 10;
  return row % 2 === 0 ? col + 1 : 10 - col;
}

function createBoard() {
  for (let row = 0; row < 3; row += 1) {
    const cellsInRow = [];
    for (let col = 1; col <= 10; col += 1) {
      const logicalIndex = row * 10 + (row % 2 === 0 ? col : 11 - col);
      cellsInRow.push(logicalIndex);
    }

    cellsInRow.forEach((i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = String(i);
      cell.style.backgroundImage = watercolorBackground(i, (i * 29) % 360);

      const label = document.createElement("div");
      label.className = "cell-label";
      label.textContent = i === 1 ? "התחלה" : i === totalCells ? "סוף" : animalScenes[i - 1];

      const number = document.createElement("div");
      number.className = "cell-number";
      number.textContent = String(i);

      const tokens = document.createElement("div");
      tokens.className = "tokens";

      if (i === 1) {
        cell.classList.add("start");
      }

      if (i === totalCells) {
        cell.classList.add("finish");
      }

      cell.append(label, number, tokens);
      boardEl.appendChild(cell);
    });
  }
}

function renderTokens() {
  document.querySelectorAll(".tokens").forEach((tokensEl) => {
    tokensEl.innerHTML = "";
  });

  playerPositions.forEach((position, idx) => {
    const targetCell = document.querySelector(`.cell[data-index="${position}"] .tokens`);
    if (!targetCell) return;

    const token = document.createElement("span");
    token.className = `token player${idx + 1}`;
    token.title = `שחקן ${idx + 1}`;
    targetCell.appendChild(token);
  });

  player1StatusEl.textContent = `שחקן 1 נמצא במשבצת: ${playerPositions[0] === 1 ? "התחלה" : playerPositions[0]}`;
  player2StatusEl.textContent = `שחקן 2 נמצא במשבצת: ${playerPositions[1] === 1 ? "התחלה" : playerPositions[1]}`;
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function takeTurn() {
  if (gameOver) return;

  const dice = rollDice();
  const next = Math.min(playerPositions[currentPlayer] + dice, totalCells);
  playerPositions[currentPlayer] = next;
  diceResultEl.textContent = `תוצאת קובייה: ${dice}`;

  if (next === totalCells) {
    gameOver = true;
    gameMessageEl.textContent = `שחקן ${currentPlayer + 1} ניצח!`;
    turnIndicatorEl.textContent = "המשחק הסתיים";
    rollButton.disabled = true;
  } else {
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    turnIndicatorEl.textContent = `תור נוכחי: שחקן ${currentPlayer + 1}`;
    gameMessageEl.textContent = "";
  }

  renderTokens();
}

rollButton.addEventListener("click", takeTurn);

createBoard();
renderTokens();
