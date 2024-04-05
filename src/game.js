import Gameboard from "./gameboard";
import Player from "./players";
import {
  changeRotateBtn,
  removeContainerEvents,
  renderBoards,
  renderPage,
} from "./render";

// Main game loop func
export function gameLoop() {
  const playerOne = new Player("Daniel");
  const playerTwo = new Player("AI");
  const players = [playerOne, playerTwo];
  const boardOne = new Gameboard(false);
  const boardTwo = new Gameboard(true);
  const boards = [boardOne, boardTwo];
  boardOne.generateBoard();
  boardTwo.generateBoard();
  renderPage(boards, players);
}

// Place computer ships and allow player to shoot
function startGame(boards, webBoards, players) {
  if (boards[1].start === false) {
    let i = 5;
    while (boards[1].shipsLength !== 0) {
      const x = Math.round(Math.random() * 9);
      const y = Math.round(Math.random() * 9);
      const direction =
        Math.round(Math.random()) === 1 ? "horizontal" : "vertical";
      if (boards[1].placeShip([x, y], i, direction) === true) {
        i--;
      }
    }
    boards[1].start = true;
  }
  const container = document.querySelector(".container");
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
        const attackWon = board.receiveAttack([x, y], players);
        renderBoards(boards, webBoards, players);
        if (attackWon === true) {
          removeContainerEvents();
        } else {
          setTimeout(() => {
            const aiAttackWon = players[1].aiTurn(boards[0]);
            renderBoards(boards, webBoards, players);
            if (aiAttackWon === true) {
              removeContainerEvents();
            }
          }, 100);
        }
      }
    }
  });
}

// Checking if player placed all ships before starting game
export function checkForStartingGame(boards, webBoards, players) {
  if (boards[0].shipsLength === 0) {
    changeRotateBtn();
    startGame(boards, webBoards, players);
  }
}
