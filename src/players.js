import Gameboard from "./gameboard";

export default class Player {
  constructor(name) {
    this.name = name;
  }

  playerTurn(enemyBoard, coordinates) {
    const turn = enemyBoard.receiveAttack(coordinates);
    return turn;
  }

  generateRandomCords() {
    const x = Math.round(Math.random() * 10);
    const y = Math.round(Math.random() * 10);
    return [x, y];
  }

  aiTurn(enemyBoard) {
    let cords = this.generateRandomCords();
    if (enemyBoard.hitsBoard[cords[0]][cords[1]] === false) {
      const turn = enemyBoard.receiveAttack([cords[0], cords[1]]);
      return turn;
    }

    while (enemyBoard.hitsBoard[cords[0]][cords[1]] === true) {
      cords = this.generateRandomCords();
      if (enemyBoard.hitsBoard[cords[0]][cords[1]] === false) {
        const turn = enemyBoard.receiveAttack([cords[0], cords[1]]);
        return turn;
      }
    }
  }
}
