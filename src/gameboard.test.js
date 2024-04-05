import Gameboard from "./gameboard";

const board = new Gameboard(false);

test("checking for a hit and destruction", () => {
  board.generateBoard();
  board.placeShip([1, 2], 2, "horizontal");
  board.receiveAttack([1, 2]);
  board.receiveAttack([2, 2]);
  expect(board.board[1][2].sunk).toBeTruthy();
});
