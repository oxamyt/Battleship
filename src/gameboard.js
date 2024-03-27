import Ship from "./ships";

export default class Gameboard {
  constructor() {
    this.board = [];
    this.hitsBoard = [];
  }

  generateBoard(r = 10, c = 10) {
    this.board = Array(r)
      .fill(0)
      .map(() => Array(c).fill(0));
    this.hitsBoard = Array(r)
      .fill(false)
      .map(() => Array(c).fill(false));
  }

  placeShip(start, length, direction) {
    const newShip = new Ship(length);

    if (start[0] > this.board.length || start[1] > this.board.length) {
      return "limit";
    }

    if (direction === "horizontal") {
      if (start[0] + length > this.board.length) {
        return "limit";
      }
      for (let i = 0; i < length; i++) {
        if (this.board[start[0] + i][start[1]] !== 0) return "It`s occupied";
      }
      for (let i = 0; i < length; i++) {
        this.board[start[0] + i][start[1]] = newShip;
      }
    }

    if (direction === "vertical") {
      if (start[1] + length > this.board.length) {
        return "limit";
      }
      for (let i = 0; i < length; i++) {
        if (this.board[start[0]][start[1] + i] !== 0) return "It`s occupied";
      }
      for (let i = 0; i < length; i++) {
        this.board[start[0]][start[1] + i] = newShip;
      }
    }
  }

  receiveAttack(coordinates) {
    if (
      coordinates[0] > this.board.length ||
      coordinates[1] > this.board.length
    ) {
      console.log("wrong coordinate");
      return false;
    }
    const cell = this.board[coordinates[0]][coordinates[1]];
    const cellHit = this.hitsBoard[coordinates[0]][coordinates[1]];
    if (cellHit === false) {
      if (cell !== 0) {
        cell.hit();
        this.hitsBoard[coordinates[0]][coordinates[1]] = true;
        cell.isSunk();
        if (this.checkingWin() === true) {
          console.log("End of the game");
        }
        return true;
      }
      this.hitsBoard[coordinates[0]][coordinates[1]] = true;
      return false;
    }
  }

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
