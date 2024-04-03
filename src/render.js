import { checkForStartingGame, gameLoop } from "./game";

export function renderPage(boards, players) {
  const container = document.querySelector(".container");
  container.innerHTML = "";

  const main = document.createElement("div");
  main.classList.add("main");

  const rotateDiv = document.createElement("div");
  rotateDiv.classList.add("rotate-div");

  const rotateBtn = document.createElement("button");
  rotateBtn.classList.add("rotate-btn");
  rotateBtn.textContent = "Rotate Ship";

  const gameboards = document.createElement("div");
  gameboards.classList.add("gameboards");

  const leftBoard = document.createElement("div");
  leftBoard.classList.add("left-board");

  const rightBoard = document.createElement("div");
  rightBoard.classList.add("right-board");

  const footer = document.createElement("div");
  footer.classList.add("footer");

  const restartBtn = document.createElement("button");
  restartBtn.classList.add("restart-btn");
  restartBtn.textContent = "Restart game";

  container.appendChild(main);
  container.appendChild(footer);
  footer.appendChild(restartBtn);
  main.appendChild(rotateDiv);
  rotateDiv.appendChild(rotateBtn);
  main.appendChild(gameboards);
  gameboards.appendChild(leftBoard);
  gameboards.appendChild(rightBoard);

  attachRotateEvent(rotateBtn, boards, [leftBoard, rightBoard], players);
  attachRestartEvent(restartBtn);

  renderBoards(boards, [leftBoard, rightBoard], players);
}

export function renderBoards(boards, webBoards, players) {
  for (let i = 0; i < boards.length; i++) {
    webBoards[i].innerHTML = "";
    const isVertical = webBoards[i]
      .closest(".main")
      .querySelector(".rotate-btn")
      .hasAttribute("vertical");
    for (let x = 0; x < boards[i].board.length; x++) {
      for (let y = 0; y < boards[i].board.length; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (boards[i].board[x][y] !== 0 && boards[i].isEnemy === false)
          cell.classList.add("ship");
        if (
          boards[i].hitsBoard[x][y] !== false &&
          boards[i].board[x][y] !== 0
        ) {
          cell.classList.add("hit");
        }
        if (
          boards[i].hitsBoard[x][y] !== false &&
          boards[i].board[x][y] === 0
        ) {
          cell.classList.add("miss");
        }

        cell.setAttribute("data-x", x);
        cell.setAttribute("data-y", y);

        if (boards[i].shipsLength !== 0) {
          if (webBoards[i].classList.contains("left-board")) {
            attachCellsHighlight(boards, webBoards, cell, isVertical);

            cell.addEventListener("click", (e) => {
              const clickedX = parseInt(e.target.getAttribute("data-x"));
              const clickedY = parseInt(e.target.getAttribute("data-y"));
              const direction = isVertical ? "vertical" : "horizontal";

              if (!cell.classList.contains("ship")) {
                boards[i].placeShip(
                  [clickedX, clickedY],
                  boards[i].shipsLength,
                  direction,
                );

                removeHighlight(webBoards[i]);
                checkForStartingGame(boards, webBoards, players);
                renderBoards(boards, webBoards, players);
              }
            });
          }
        }
        webBoards[i].appendChild(cell);
      }
    }
  }
}

function highlightCells(boardDOM, hoverX, hoverY, direction, shipLength) {
  for (let i = 0; i < shipLength; i++) {
    const x = direction === "vertical" ? hoverX + i : hoverX;
    const y = direction === "vertical" ? hoverY : hoverY + i;
    const cell = boardDOM.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (cell === null) return;
    if (!cell.classList.contains("ship")) {
      cell.classList.add("highlight");
    } else if (cell.classList.contains("ship") === null) {
      return;
    }
  }
}

function removeHighlight(boardDOM) {
  boardDOM.querySelectorAll(".highlight").forEach((cell) => {
    cell.classList.remove("highlight");
  });
}

function attachRotateEvent(rotateBtn, boards, webBoards, players) {
  rotateBtn.addEventListener("click", () => {
    rotateBtn.toggleAttribute("vertical");
    renderBoards(boards, [webBoards[0], webBoards[1]], players);
  });
}

function attachCellsHighlight(boards, webBoards, cell, isVertical) {
  cell.addEventListener("mouseenter", (e) => {
    const hoverX = parseInt(e.target.getAttribute("data-x"));
    const hoverY = parseInt(e.target.getAttribute("data-y"));
    const direction = isVertical ? "horizontal" : "vertical";
    highlightCells(
      webBoards[0],
      hoverX,
      hoverY,
      direction,
      boards[0].shipsLength,
    );
  });

  cell.addEventListener("mouseleave", () => {
    removeHighlight(webBoards[0]);
  });
}

function attachRestartEvent(restartBtn) {
  restartBtn.addEventListener("click", () => {
    gameLoop();
  });
}
