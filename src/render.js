import { addEventListeners, gameLoop } from "./game";

export function renderPage(boards, players) {
  const container = document.querySelector(".container");
  container.innerHTML = "";

  // const header = document.createElement("div");
  // header.classList.add("header");

  // const name = document.createElement("div");
  // name.classList.add("name");

  // const gameName = document.createElement("p");
  // gameName.classList.add("game-name");
  // gameName.textContent = "Battleship";

  // const startBtn = document.createElement("div");
  // startBtn.classList.add("start-btn");

  // const start = document.createElement("button");
  // start.classList.add("start");
  // start.textContent = "Start Game";

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

  // container.appendChild(header);
  container.appendChild(main);
  // header.appendChild(name);
  // name.appendChild(gameName);
  // header.appendChild(startBtn);
  // startBtn.appendChild(start);
  main.appendChild(rotateBtn);
  rotateBtn.appendChild(rotate);
  main.appendChild(gameboards);
  gameboards.appendChild(leftBoard);
  gameboards.appendChild(rightBoard);

  renderBoard(boards[0], leftBoard);
  renderBoard(boards[1], rightBoard);

  if (!container.hasAttribute("event-listener")) {
    container.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("cell") &&
        !e.target.classList.contains("miss") &&
        !e.target.classList.contains("hit")
      ) {
        const cell = e.target;
        const x = e.target.getAttribute("data-x");
        const y = e.target.getAttribute("data-y");
        if (cell.closest(".right-board")) {
          const board = boards[1];
          board.receiveAttack([x, y]);
          container.setAttribute("event-listener", true);
          renderPage(boards);
          setTimeout(() => {
            players[0].aiTurn(boards[0]);
            renderPage(boards);
          }, 100);
        }
      }
    });
  }
}

export function renderBoard(gameboard, boardDOM) {
  for (let x = 0; x < gameboard.board.length; x++) {
    for (let y = 0; y < gameboard.board.length; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (gameboard.board[x][y] !== 0 && gameboard.isEnemy === false)
        cell.classList.add("ship");
      if (gameboard.hitsBoard[x][y] !== false && gameboard.board[x][y] !== 0) {
        cell.classList.add("hit");
      }
      if (gameboard.hitsBoard[x][y] !== false && gameboard.board[x][y] === 0) {
        cell.classList.add("miss");
      }
      cell.setAttribute("data-x", x);
      cell.setAttribute("data-y", y);
      boardDOM.appendChild(cell);
    }
  }
}
