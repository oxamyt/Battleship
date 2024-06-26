import { showWinner } from "./render";
import Ship from "./ships";

export default class Gameboard {
  constructor(isEnemy) {
    this.board = [];
    this.hitsBoard = [];
    this.isEnemy = isEnemy;
    this.shipsLength = 5;
    this.start = false;
  }

  // Generating 10x10 gameboard
  generateBoard(r = 10, c = 10) {
    this.board = Array(r)
      .fill(0)
      .map(() => Array(c).fill(0));
    this.hitsBoard = Array(r)
      .fill(false)
      .map(() => Array(c).fill(false));
  }

  // Placing ship in gameboard
  placeShip(start, length, direction) {
    const newShip = new Ship(length);

    if (direction === "horizontal") {
      if (start[0] + length > this.board.length) {
        return false;
      }
      for (let i = 0; i < length; i++) {
        if (this.board[start[0] + i][start[1]] !== 0) return false;
      }
      for (let i = 0; i < length; i++) {
        this.board[start[0] + i][start[1]] = newShip;
      }
      this.shipsLength--;
      return true;
    }

    if (direction === "vertical") {
      if (start[1] + length > this.board.length) {
        return false;
      }
      for (let i = 0; i < length; i++) {
        if (this.board[start[0]][start[1] + i] !== 0) return false;
      }
      for (let i = 0; i < length; i++) {
        this.board[start[0]][start[1] + i] = newShip;
      }
      this.shipsLength--;
      return true;
    }
    return false;
  }

  // Checking if received attack hit ship
  receiveAttack(coordinates) {
    const cell = this.board[coordinates[0]][coordinates[1]];
    const cellHit = this.hitsBoard[coordinates[0]][coordinates[1]];
    if (cellHit === false) {
      if (cell !== 0) {
        cell.hit();
        this.hitsBoard[coordinates[0]][coordinates[1]] = true;
        cell.isSunk();
        if (this.checkingWin() === true) {
          const winner = this.isEnemy === true ? "Player" : "Computer";
          showWinner(winner);
          return true;
        }
      }
      this.hitsBoard[coordinates[0]][coordinates[1]] = true;
    }
    return false;
  }

  // Checking conditions for win
  checkingWin() {
    const ships = [];
    const destroyedShips = [];
    this.board.forEach((elememt) =>
      elememt.forEach((elem) => {
        if (elem !== 0) {
          ships.push(elem);
        }
      }),
    );
    for (let i = 0; i < ships.length; i++) {
      if (ships[i].sunk === true) {
        destroyedShips.push(ships[i]);
      }
    }
    if (ships.length === destroyedShips.length) {
      return true;
    }

    return false;
  }
}
