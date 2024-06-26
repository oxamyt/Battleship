export default class Player {
  constructor(name) {
    this.name = name;
  }

  // Generating random cords for computer ships
  generateRandomCords() {
    const x = Math.round(Math.random() * 9);
    const y = Math.round(Math.random() * 9);
    return [x, y];
  }

  // Computer makes attack at random coordinates
  aiTurn(enemyBoard) {
    let cords;
    do {
      cords = this.generateRandomCords();
    } while (enemyBoard.hitsBoard[cords[0]][cords[1]] === true);
    const turn = enemyBoard.receiveAttack([cords[0], cords[1]]);
    return turn;
  }
}
