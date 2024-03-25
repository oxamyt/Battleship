import Ship from "./ships";

export default class Gameboard {
  constructor() {
    this.board = [];
  }

  generateBoard(r = 10, c = 10) {
    this.board = Array(r)
      .fill(0)
      .map(() => Array(c).fill(0));
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
}
