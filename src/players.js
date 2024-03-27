import Gameboard from "./gameboard";

export default class Player {
  constructor(name) {
    this.name = name;
  }

  takeTurn(enemyBoard, coordinates) {
    const turn = enemyBoard.receiveAttack(coordinates);
    return turn;
  }
}
