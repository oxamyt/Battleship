export default function renderPage() {
  const container = document.querySelector(".container");

  const header = document.createElement("div");
  header.classList.add("header");

  const name = document.createElement("div");
  name.classList.add("name");

  const gameName = document.createElement("p");
  gameName.classList.add("game-name");
  gameName.textContent = "Battleship";

  const startBtn = document.createElement("div");
  startBtn.classList.add("start-btn");

  const start = document.createElement("button");
  start.classList.add("start");
  start.textContent = "Start Game";

  const main = document.createElement("div");
  main.classList.add("main");

  const rotateBtn = document.createElement("div");
  rotateBtn.classList.add("rotate-btn");

  const rotate = document.createElement("button");
  rotate.classList.add("rotate");
  rotate.textContent = "Rotate Ship";

  const gameboards = document.createElement("div");
  gameboards.classList.add("gameboards");

  const leftBoard = document.createElement("div");
  leftBoard.classList.add("left-board");

  const rightBoard = document.createElement("div");
  rightBoard.classList.add("right-board");

  container.appendChild(header);
  container.appendChild(main);
  header.appendChild(name);
  name.appendChild(gameName);
  header.appendChild(startBtn);
  startBtn.appendChild(start);
  main.appendChild(rotateBtn);
  rotateBtn.appendChild(rotate);
  main.appendChild(gameboards);
  gameboards.appendChild(leftBoard);
  gameboards.appendChild(rightBoard);

  renderBoard(leftBoard);
  renderBoard(rightBoard);
}

function renderBoard(board) {
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
  }
}
